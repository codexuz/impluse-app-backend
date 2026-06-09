import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { Telegraf, Context, Markup } from 'telegraf';
import { User } from '../users/entities/user.entity.js';
import { Group } from '../groups/entities/group.entity.js';
import { StaffAttendanceService } from '../staff-attendance/staff-attendance.service.js';
import { StaffAttendance } from '../staff-attendance/entities/staff-attendance.entity.js';
import { StaffPermission } from '../staff-attendance/entities/staff-permission.entity.js';
import { StaffProfileService } from '../staff-profile/staff-profile.service.js';

// Pending GPS verification state: chatId → staffId awaiting location share
type PendingGps = { staffId: string; requestedAt: number };

// Leave-request (ruxsat) conversation state: chatId → in-flight request
type LeaveType = 'full_day' | 'late_arrival' | 'early_leave';
type PendingLeave = {
  staffId: string;
  type: LeaveType;
  step: 'type' | 'date' | 'time' | 'reason';
  startDate?: string;
  endDate?: string;
  permittedTime?: string;
};

@Injectable()
export class AttendanceBotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(AttendanceBotService.name);

  // In-memory map — survives only within the process lifetime (fine for a single instance)
  private readonly pendingGps = new Map<string, PendingGps>();
  private readonly GPS_TTL_MS = 3 * 60 * 1000; // 3 minutes to share location

  // In-flight leave (ruxsat) requests, keyed by chatId
  private readonly pendingLeave = new Map<string, PendingLeave>();

  // Cron de-dup so a reminder / late alert fires only once per staff+shift+day.
  private dedupDate = '';
  private readonly remindersSent = new Set<string>();
  private readonly lateAlertsSent = new Set<string>();

  private static readonly STAFF_ROLES = ['teacher', 'admin', 'support_teacher'];
  private readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  // Authorized Telegram chat IDs — comma-separated in env ATTENDANCE_BOT_ADMIN_IDS
  private get authorizedIds(): string[] {
    const raw = process.env.ATTENDANCE_BOT_ADMIN_IDS || '';
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly staffAttendanceService: StaffAttendanceService,
    private readonly staffProfileService: StaffProfileService,
  ) {
    const token = process.env.ATTENDANCE_BOT_TOKEN;
    if (!token) throw new Error('ATTENDANCE_BOT_TOKEN env variable is not set');
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.registerCommands();

    await this.bot.telegram.setMyCommands([
      { command: 'davomat', description: 'Davomatni qo\'yish (GPS orqali)' },
      { command: 'link', description: 'Telegram hisobni bog\'lash: /link <login>' },
      { command: 'today', description: 'Bugungi davomat hisoboti' },
      { command: 'week', description: 'Shu haftalik hisobot' },
      { command: 'month', description: 'Shu oylik hisobot' },
      { command: 'ruxsat', description: 'Ruxsat (dam olish) so\'rovi yuborish' },
    ]);

    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
      const path = `/api/attendance-bot/webhook`;
      await this.bot.telegram.setWebhook(`${webhookUrl}${path}`);
      this.logger.log(`Attendance Bot webhook set to: ${webhookUrl}${path}`);
    } else {
      this.bot.launch();
      this.logger.log('Attendance Bot started in polling mode');
    }

    this.logger.log('Attendance Bot Service initialized');
  }

  getBotInstance(): Telegraf {
    return this.bot;
  }

  // ---------------------------------------------------------------------------
  // Auth guard
  // ---------------------------------------------------------------------------

  private isAuthorized(chatId: string): boolean {
    const ids = this.authorizedIds;
    // If no IDs configured, deny all (fail-safe)
    if (ids.length === 0) return false;
    return ids.includes(chatId);
  }

  // ---------------------------------------------------------------------------
  // Command registration
  // ---------------------------------------------------------------------------

  private registerCommands() {
    this.bot.start(async (ctx) => {
      const payload = (ctx as any).startPayload as string | undefined;
      const chatId = String(ctx.chat.id);

      if (payload) {
        const staffId = payload.trim();
        // Check if the teacher is opening their own QR (self-attendance flow)
        const self = await this.userModel.findOne({
          where: { telegram_chat_id: chatId },
          include: [{ association: 'roles' }],
        });

        if (self && self.user_id === staffId) {
          // Self-attendance: ask for GPS
          await this.requestGpsForSelf(ctx, self);
          return;
        }

        // Admin / guard flow: show IN/OUT buttons (existing)
        if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
        await this.promptScanType(ctx, staffId);
      } else {
        // Check if this is a known staff member (self-attendance entry point)
        const self = await this.userModel.findOne({
          where: { telegram_chat_id: chatId },
          include: [{ association: 'roles' }],
        });
        if (self) {
          await this.requestGpsForSelf(ctx, self);
          return;
        }
        await ctx.reply(
          'Xodimlar davomati botiga xush kelibsiz.\n\nQR kodingizni skanerlang yoki UUID ni yuboring.',
        );
      }
    });

    // /link <username> — teacher links their Telegram account for self-attendance
    this.bot.command('link', async (ctx) => {
      const parts = ctx.message.text.split(' ');
      const username = parts[1]?.trim();
      if (!username) {
        await ctx.reply('Foydalanish: /link <login>\nMisol: /link sarvar_doniyorov');
        return;
      }
      const user = await this.userModel.findOne({
        where: { username },
        include: [{ association: 'roles' }],
      });
      if (!user) {
        await ctx.reply(`❌ "${username}" logini bilan foydalanuvchi topilmadi.`);
        return;
      }
      const roleNames = ((user.roles || []) as any[]).map((r) => r.name as string);
      const isStaff = roleNames.some((r) => ['teacher', 'admin', 'support_teacher'].includes(r));
      if (!isStaff) {
        await ctx.reply('❌ Faqat xodimlar (o\'qituvchi, admin, yordamchi) bog\'lanishi mumkin.');
        return;
      }
      await user.update({ telegram_chat_id: String(ctx.chat.id) });
      await ctx.reply(
        `✅ Telegram hisobingiz muvaffaqiyatli bog\'landi!\n👤 ${user.first_name} ${user.last_name}\n\nEndi /start yoki /davomat buyrug\'i orqali davomatni o\'zingiz qo\'ya olasiz.`,
      );
    });

    // /davomat — shortcut for self-attendance
    this.bot.command('davomat', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const self = await this.userModel.findOne({
        where: { telegram_chat_id: chatId },
        include: [{ association: 'roles' }],
      });
      if (!self) {
        await ctx.reply('Hisobingiz bog\'lanmagan. /link <login> orqali bog\'lang.');
        return;
      }
      await this.requestGpsForSelf(ctx, self);
    });

    // /today [teacherId] — today's attendance summary
    this.bot.command('today', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const parts = ctx.message.text.split(' ');
      const id = parts[1]?.trim();

      if (id) {
        if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
        await this.sendTodaySummary(ctx, id);
      } else {
        // Teacher checking their own summary
        const self = await this.userModel.findOne({ where: { telegram_chat_id: chatId } });
        if (self) {
          await this.sendTodaySummary(ctx, self.user_id);
        } else {
          await ctx.reply('Foydalanish: /today <teacher_id>');
        }
      }
    });

    // /week [teacherId] — this week's summary
    this.bot.command('week', (ctx) => this.handleRangeReport(ctx, 'week'));

    // /month [teacherId] — this month's summary
    this.bot.command('month', (ctx) => this.handleRangeReport(ctx, 'month'));

    // /ruxsat — start a leave (permission) request flow
    this.bot.command('ruxsat', (ctx) => this.startLeaveRequest(ctx));

    // Callback: in/out button presses (admin) OR gps_cancel (teacher)
    this.bot.on('callback_query', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const data = (ctx.callbackQuery as any).data as string;
      await ctx.answerCbQuery();

      if (data === 'gps_cancel') {
        this.pendingGps.delete(chatId);
        await ctx.editMessageText('❌ Davomat bekor qilindi.');
        return;
      }

      if (data?.startsWith('scan:')) {
        if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
        const [, teacherId, scanType] = data.split(':');
        await this.recordAttendance(ctx, teacherId, scanType as 'in' | 'out');
        return;
      }

      // Leave flow: staff picked a permission type
      if (data?.startsWith('leave:')) {
        const type = data.split(':')[1] as LeaveType;
        const state = this.pendingLeave.get(chatId);
        if (!state) {
          await ctx.reply('So\'rov eskirgan. /ruxsat ni qayta bosing.');
          return;
        }
        state.type = type;
        state.step = 'date';
        await ctx.editMessageText(
          `📋 ${this.leaveTypeLabel(type)}\n\n📅 Sanani yuboring:\n` +
            '• "bugun" yoki "ertaga"\n' +
            '• YYYY-MM-DD (masalan 2026-06-10)\n' +
            '• Oraliq: 2026-06-10 2026-06-12',
        );
        return;
      }

      // Leave flow: admin approved / rejected
      if (data?.startsWith('leave_approve:') || data?.startsWith('leave_reject:')) {
        if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
        const [, permissionId] = data.split(':');
        const decision = data.startsWith('leave_approve') ? 'approved' : 'rejected';
        await this.reviewLeaveByAdmin(ctx, permissionId, decision);
        return;
      }
    });

    // Location message — GPS self-attendance
    this.bot.on('location', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const message = ctx.message as any;
      const location = message.location;

      // Only a LIVE location is accepted. Telegram guarantees it comes from the
      // device's real-time GPS, and it cannot be forwarded or hand-picked —
      // forwarding a live location turns it into a static snapshot (no
      // live_period). Static locations (forwarded, copied, or a pin dragged on
      // the map) have no live_period and are spoofable, so they're rejected.
      if (!location?.live_period) {
        await this.safeDeleteMessage(ctx);
        await ctx.reply(
          '❌ Faqat JONLI joylashuv (live location) qabul qilinadi.\n\n' +
            'Statik, forward qilingan yoki xaritadan tanlangan joylashuv qabul qilinmaydi.\n\n' +
            'Yuborish uchun: 📎 → Joylashuv (Location) → "Jonli joylashuvni ulashish" (Share Live Location) ni tanlang.',
          Markup.removeKeyboard(),
        );
        return;
      }

      const pending = this.pendingGps.get(chatId);

      if (!pending) {
        await this.safeDeleteMessage(ctx);
        await ctx.reply('Joylashuv kutilmagan. Davomatni boshlash uchun /start ni bosing.');
        return;
      }

      if (Date.now() - pending.requestedAt > this.GPS_TTL_MS) {
        this.pendingGps.delete(chatId);
        await this.safeDeleteMessage(ctx);
        await ctx.reply('⏱ Vaqt tugadi. Iltimos, qaytadan urinib ko\'ring.');
        return;
      }

      this.pendingGps.delete(chatId);
      const { latitude, longitude } = location;
      await this.handleGpsAttendance(ctx, pending.staffId, latitude, longitude);

      // Delete the shared live-location message so it can't be re-used or forwarded.
      await this.safeDeleteMessage(ctx);
    });

    // Plain text / UUID message
    this.bot.on('message', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const text = ((ctx.message as any).text as string | undefined)?.trim();
      if (!text) return;

      // Cancel button from GPS / leave keyboard
      if (text === '❌ Bekor qilish') {
        this.pendingGps.delete(chatId);
        this.pendingLeave.delete(chatId);
        await ctx.reply('❌ Bekor qilindi.', Markup.removeKeyboard());
        return;
      }

      // Mid-flight leave request → consume this text as the next answer
      if (this.pendingLeave.has(chatId)) {
        await this.handleLeaveStep(ctx, text);
        return;
      }

      // Known teacher sending their own UUID or just any text → self-attendance
      const self = await this.userModel.findOne({
        where: { telegram_chat_id: chatId },
        include: [{ association: 'roles' }],
      });
      if (self) {
        await this.requestGpsForSelf(ctx, self);
        return;
      }

      if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
      await this.promptScanType(ctx, text);
    });
  }

  // ---------------------------------------------------------------------------
  // Self-attendance (GPS) flow
  // ---------------------------------------------------------------------------

  /** Ask the teacher to share their live location */
  private async requestGpsForSelf(ctx: Context, staff: User) {
    const chatId = String(ctx.chat.id);
    const roleNames = ((staff.roles || []) as any[]).map((r) => r.name as string);
    const isStaff = roleNames.some((r) => ['teacher', 'admin', 'support_teacher'].includes(r));

    if (!isStaff) {
      await ctx.reply('Kechirasiz, siz ushbu botdan foydalanish huquqiga ega emassiz.');
      return;
    }

    // Shift-count-aware: which shift / direction is next for this staff member
    const plan = await this.staffAttendanceService.getNextScanPlan(staff.user_id);

    if (plan.allDone) {
      await ctx.reply(
        `✅ ${staff.first_name} ${staff.last_name}, bugungi barcha smenalar ` +
          `(${plan.totalShifts} ta) uchun davomat yakunlangan.`,
        Markup.removeKeyboard(),
      );
      return;
    }

    const nextLabel = plan.nextType === 'in' ? 'KIRISH ✅' : 'CHIQISH 🚪';
    const shift = plan.shift;
    const shiftName = shift?.name ? `${this.shiftNameLabel(shift.name)} ` : '';
    const shiftInfo = shift
      ? `🕐 ${shiftName}smena: ${shift.in_time.slice(0, 5)}–${shift.out_time ? shift.out_time.slice(0, 5) : '?'}`
      : '🕐 Smena belgilanmagan';
    const shiftCounter = plan.totalShifts > 1 ? `\n📌 Smena ${plan.shiftIndex + 1}/${plan.totalShifts}` : '';

    this.pendingGps.set(chatId, { staffId: staff.user_id, requestedAt: Date.now() });

    await ctx.reply(
      `👤 ${staff.first_name} ${staff.last_name}\n${shiftInfo}${shiftCounter}\n📍 Davomat: ${nextLabel}\n\n` +
        '📍 JONLI joylashuvingizni yuboring (3 daqiqa ichida):\n' +
        '📎 → Joylashuv (Location) → "Jonli joylashuvni ulashish" (Share Live Location)',
      Markup.keyboard([['❌ Bekor qilish']]).resize().oneTime(),
    );
  }

  /** Validate GPS and record attendance for the teacher themselves */
  private async handleGpsAttendance(
    ctx: Context,
    staffId: string,
    lat: number,
    lon: number,
  ) {
    const centerLat = parseFloat(process.env.CENTER_LATITUDE ?? '0');
    const centerLon = parseFloat(process.env.CENTER_LONGITUDE ?? '0');
    const radiusM = parseFloat(process.env.GPS_RADIUS_METERS ?? '200');

    if (!centerLat || !centerLon) {
      this.logger.error('CENTER_LATITUDE/CENTER_LONGITUDE not configured');
      await ctx.reply('❌ GPS tekshiruvi sozlanmagan. Admin bilan bog\'laning.');
      return;
    }

    const distanceM = this.haversineDistance(lat, lon, centerLat, centerLon);

    if (distanceM > radiusM) {
      await ctx.reply(
        `❌ Siz o'quv markazidan tashqaridasiz.\n📏 Masofa: ${Math.round(distanceM)} m (ruxsat: ${radiusM} m)\n\nDavomat faqat o'quv markazi hududida qo'yilishi mumkin.`,
        Markup.removeKeyboard(),
      );
      return;
    }

    const teacher = await this.userModel.findByPk(staffId, {
      include: [{ association: 'roles' }],
    });
    if (!teacher) {
      await ctx.reply('❌ Foydalanuvchi topilmadi.', Markup.removeKeyboard());
      return;
    }

    try {
      const attendance = await this.staffAttendanceService.automaticScan(staffId);
      const msg = this.formatAttendanceMessage(teacher, attendance);
      await ctx.reply(
        `✅ GPS tasdiqlandi (${Math.round(distanceM)} m)\n\n${msg}\n\n` +
          'ℹ️ Endi jonli joylashuvni to\'xtatishingiz mumkin (Stop sharing).',
        Markup.removeKeyboard(),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`GPS attendance error for ${staffId}: ${message}`);
      await ctx.reply(`❌ Xatolik: ${message}`, Markup.removeKeyboard());
    }
  }

  /** Delete the current message, swallowing errors (e.g. already deleted / no rights). */
  private async safeDeleteMessage(ctx: Context): Promise<void> {
    try {
      await ctx.deleteMessage();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.debug(`Could not delete message: ${message}`);
    }
  }

  /** Haversine formula — returns distance in metres between two GPS points */
  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in metres
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // ---------------------------------------------------------------------------
  // Flow helpers
  // ---------------------------------------------------------------------------

  private async replyUnauthorized(ctx: Context) {
    this.logger.warn(`Unauthorized access by Telegram ID: ${ctx.chat?.id}`);
    return ctx.reply('Kechirasiz, siz ushbu botdan foydalanish huquqiga ega emassiz.');
  }

  /** Parse input → resolve teacher → show IN/OUT buttons */
  private async promptScanType(ctx: Context, input: string) {
    let teacherId = input;

    try {
      const json = JSON.parse(input);
      if (json.teacher_id) teacherId = json.teacher_id;
    } catch {
      // raw UUID
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(teacherId)) {
      return ctx.reply('Noto\'g\'ri ID. Iltimos, haqiqiy QR kodni skanerlang.');
    }

    const teacher = await this.userModel.findByPk(teacherId, {
      include: [{ association: 'roles' }],
    });
    if (!teacher) return ctx.reply('Foydalanuvchi topilmadi.');

    const roleNames = ((teacher.roles || []) as any[]).map((r) => r.name as string);
    const isTeacher = roleNames.includes('teacher');

    const now = this.getUzTime();
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Shift-count-aware plan drives the next direction and the target shift.
    const plan = await this.staffAttendanceService.getNextScanPlan(teacherId);
    const nextType = plan.nextType;
    const nextLabel = nextType === 'in' ? '➡️ Keyingi: KIRISH' : '➡️ Keyingi: CHIQISH';

    let scheduleInfo: string;
    if (plan.allDone) {
      scheduleInfo = `✅ Bugungi barcha smenalar (${plan.totalShifts} ta) yakunlangan`;
    } else if (plan.shift) {
      const shift = plan.shift;
      const shiftName = shift.name ? `${this.shiftNameLabel(shift.name)} ` : '';
      scheduleInfo = `🕐 ${shiftName}Smena: ${shift.in_time.slice(0, 5)}–${shift.out_time ? shift.out_time.slice(0, 5) : '?'}`;
      if (shift.grace_period_minutes > 0) {
        scheduleInfo += ` (+${shift.grace_period_minutes} daq chegirma)`;
      }
      if (plan.totalShifts > 1) {
        scheduleInfo += `\n📌 Smena ${plan.shiftIndex + 1}/${plan.totalShifts}`;
      }
    } else if (isTeacher) {
      // Fallback: closest group lesson time
      const dayOfWeek = now.getUTCDay();
      const possibleDays: string[] = ['every_day'];
      if ([1, 3, 5].includes(dayOfWeek)) possibleDays.push('odd');
      else if ([2, 4, 6].includes(dayOfWeek)) possibleDays.push('even');

      const groups = await Group.findAll({
        where: { teacher_id: teacherId, days: { [Op.in]: possibleDays }, isDeleted: false },
      });

      let bestGroup: Group | null = null;
      let minDiff = Infinity;
      for (const g of groups) {
        if (!g.lesson_start) continue;
        const [h, m] = g.lesson_start.split(':').map(Number);
        const diff = Math.abs(nowMinutes - (h * 60 + m));
        if (diff < minDiff) { minDiff = diff; bestGroup = g; }
      }

      scheduleInfo = bestGroup
        ? `📚 Guruh: ${bestGroup.name} (${bestGroup.lesson_start?.slice(0, 5)})`
        : '🕐 Smena yoki guruh belgilanmagan';
    } else {
      scheduleInfo = `🕐 Standart vaqt: 09:00`;
    }

    const name = `${teacher.first_name} ${teacher.last_name}`;
    const roleLine = roleNames.length ? `💼 ${roleNames.map((r) => this.roleLabel(r)).join(', ')}` : '';

    return ctx.reply(
      `👤 ${name}\n${roleLine}\n${scheduleInfo}\n${nextLabel}\n\nDavomat turini tanlang:`,
      Markup.inlineKeyboard([
        Markup.button.callback('✅ KIRISH', `scan:${teacherId}:in`),
        Markup.button.callback('🚪 CHIQISH', `scan:${teacherId}:out`),
      ]),
    );
  }

  /** Call the attendance service and format the result */
  private async recordAttendance(ctx: Context, teacherId: string, type: 'in' | 'out') {
    const teacher = await this.userModel.findByPk(teacherId, {
      include: [{ association: 'roles' }],
    });
    if (!teacher) return ctx.reply('Foydalanuvchi topilmadi.');

    try {
      const attendance = await this.staffAttendanceService.automaticScan(teacherId, type);
      await ctx.editMessageText(this.formatAttendanceMessage(teacher, attendance));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error recording attendance: ${message}`);
      await ctx.reply(`❌ Xatolik: ${message}`);
    }
  }

  /** Show all of today's attendance records for a teacher */
  private async sendTodaySummary(ctx: Context, teacherId: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(teacherId)) return ctx.reply('Noto\'g\'ri ID formati.');

    const teacher = await this.userModel.findByPk(teacherId);
    if (!teacher) return ctx.reply('Foydalanuvchi topilmadi.');

    const today = this.getToday();
    const records = await StaffAttendance.findAll({
      where: { teacher_id: teacherId, date: today },
      order: [['createdAt', 'ASC']],
    });

    if (records.length === 0) {
      return ctx.reply(`📋 ${teacher.first_name} ${teacher.last_name} bugun hali davomat qilmagan.`);
    }

    const statusMap: Record<string, string> = { early: 'Vaqli', on_time: "O'z vaqtida", late: 'Kechikdi' };
    const typeMap: Record<string, string> = { in: 'Kirish', out: 'Chiqish' };

    let msg = `📋 Bugungi davomat: ${teacher.first_name} ${teacher.last_name}\n\n`;
    let totalFine = 0;

    for (const r of records) {
      msg += `• ${typeMap[r.type] || r.type} — ${statusMap[r.status] || r.status}`;
      if (r.minutes_late > 0) msg += ` (${r.minutes_late} daq kechikdi)`;
      if (r.fine_amount > 0) msg += ` | 💰 ${r.fine_amount.toLocaleString()} so'm`;
      msg += '\n';
      totalFine += r.fine_amount ?? 0;
    }

    if (totalFine > 0) msg += `\n💰 Jami jarima: ${totalFine.toLocaleString()} so'm`;

    return ctx.reply(msg);
  }

  // ---------------------------------------------------------------------------
  // Reports & stats (/week, /month)
  // ---------------------------------------------------------------------------

  private async handleRangeReport(ctx: Context, range: 'week' | 'month') {
    const chatId = String(ctx.chat.id);
    const parts = ((ctx.message as any).text as string).split(' ');
    const id = parts[1]?.trim();

    let teacherId: string;
    if (id) {
      if (!this.isAuthorized(chatId)) return this.replyUnauthorized(ctx);
      teacherId = id;
    } else {
      const self = await this.userModel.findOne({ where: { telegram_chat_id: chatId } });
      if (!self) {
        await ctx.reply(`Foydalanish: /${range} <teacher_id>`);
        return;
      }
      teacherId = self.user_id;
    }

    const { startDate, endDate, label } = this.getDateRange(range);
    await this.sendRangeSummary(ctx, teacherId, startDate, endDate, label);
  }

  private getDateRange(range: 'week' | 'month'): {
    startDate: string;
    endDate: string;
    label: string;
  } {
    const uz = this.getUzTime();
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
        d.getUTCDate(),
      ).padStart(2, '0')}`;
    const endDate = fmt(uz);

    if (range === 'week') {
      const diffToMon = (uz.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
      const monday = new Date(uz.getTime() - diffToMon * 24 * 60 * 60 * 1000);
      return { startDate: fmt(monday), endDate, label: 'Shu hafta' };
    }

    const first = new Date(Date.UTC(uz.getUTCFullYear(), uz.getUTCMonth(), 1));
    return { startDate: fmt(first), endDate, label: 'Shu oy' };
  }

  private async sendRangeSummary(
    ctx: Context,
    teacherId: string,
    startDate: string,
    endDate: string,
    label: string,
  ) {
    if (!this.uuidRegex.test(teacherId)) return ctx.reply('Noto\'g\'ri ID formati.');
    const teacher = await this.userModel.findByPk(teacherId);
    if (!teacher) return ctx.reply('Foydalanuvchi topilmadi.');

    const summary = await this.staffAttendanceService.getSummary({
      startDate,
      endDate,
      teacherId,
    });
    const row = summary.data[0] as any;

    let msg = `📊 ${label} (${startDate} — ${endDate})\n👤 ${teacher.first_name} ${teacher.last_name}\n\n`;
    if (!row || row.total === 0) {
      msg += 'Bu davr uchun davomat maʼlumoti yoʻq.';
      return ctx.reply(msg);
    }

    msg += `✅ Oʻz vaqtida: ${row.on_time}\n`;
    msg += `🟢 Vaqli: ${row.early}\n`;
    msg += `⚠️ Kechikkan: ${row.late}\n`;
    msg += `📈 Davomat darajasi: ${row.attendance_rate}%`;
    if (row.late > 0) {
      msg += `\n⏰ Oʻrtacha kechikish: ${Math.round(Number(row.avg_minutes_late))} daq`;
    }
    if (Number(row.total_fine) > 0) {
      msg += `\n💰 Jami jarima: ${Number(row.total_fine).toLocaleString()} soʻm`;
    }
    return ctx.reply(msg);
  }

  // ---------------------------------------------------------------------------
  // Leave (ruxsat) request flow
  // ---------------------------------------------------------------------------

  private leaveTypeLabel(type: LeaveType): string {
    const map: Record<LeaveType, string> = {
      full_day: '🏖 Butun kun',
      late_arrival: '🕐 Kech kelish',
      early_leave: '🚪 Erta ketish',
    };
    return map[type] ?? type;
  }

  /** /ruxsat entry point — verify the staff is linked, then show type buttons. */
  private async startLeaveRequest(ctx: Context) {
    const chatId = String(ctx.chat.id);
    const self = await this.userModel.findOne({
      where: { telegram_chat_id: chatId },
      include: [{ association: 'roles' }],
    });
    if (!self) {
      await ctx.reply('Hisobingiz bogʻlanmagan. /link <login> orqali bogʻlang.');
      return;
    }
    const roleNames = ((self.roles || []) as any[]).map((r) => r.name as string);
    if (!this.isStaffRoles(roleNames)) {
      await ctx.reply('Faqat xodimlar ruxsat soʻrashi mumkin.');
      return;
    }

    this.pendingLeave.set(chatId, {
      staffId: self.user_id,
      type: 'full_day',
      step: 'type',
    });

    await ctx.reply(
      '📋 Ruxsat turini tanlang:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🏖 Butun kun', 'leave:full_day')],
        [Markup.button.callback('🕐 Kech kelish', 'leave:late_arrival')],
        [Markup.button.callback('🚪 Erta ketish', 'leave:early_leave')],
      ]),
    );
  }

  /** Handle a text answer while a leave request is in progress. */
  private async handleLeaveStep(ctx: Context, text: string) {
    const chatId = String(ctx.chat.id);
    const state = this.pendingLeave.get(chatId);
    if (!state) return;

    if (state.step === 'type') {
      await ctx.reply('Iltimos, yuqoridagi tugmalardan birini tanlang.');
      return;
    }

    if (state.step === 'date') {
      const range = this.parseDateInput(text);
      if (!range) {
        await ctx.reply(
          'Sana notoʻgʻri. Formatlar: "bugun", "ertaga", YYYY-MM-DD yoki oraliq "YYYY-MM-DD YYYY-MM-DD".',
        );
        return;
      }
      if (range.end < range.start) {
        await ctx.reply('Tugash sanasi boshlanish sanasidan oldin boʻlmasligi kerak.');
        return;
      }
      state.startDate = range.start;
      state.endDate = range.end;

      if (state.type === 'full_day') {
        state.step = 'reason';
        await ctx.reply('Sababini yozing (yoki "yoʻq"):');
      } else {
        state.step = 'time';
        await ctx.reply(
          state.type === 'late_arrival'
            ? 'Nechada kelasiz? (HH:mm) Masalan: 10:30'
            : 'Nechada ketasiz? (HH:mm) Masalan: 16:00',
        );
      }
      return;
    }

    if (state.step === 'time') {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(text)) {
        await ctx.reply('Vaqt formati notoʻgʻri. HH:mm koʻrinishida yuboring, masalan 10:30.');
        return;
      }
      state.permittedTime = text;
      state.step = 'reason';
      await ctx.reply('Sababini yozing (yoki "yoʻq"):');
      return;
    }

    if (state.step === 'reason') {
      const skip = ['yoʻq', 'yoq', "yo'q", '-', 'skip', 'yok'].includes(text.toLowerCase());
      const reason = skip ? undefined : text;
      this.pendingLeave.delete(chatId);
      await this.submitLeaveRequest(ctx, state, reason);
    }
  }

  /** Accept "bugun" / "ertaga" / a single date / a two-date range. */
  private parseDateInput(text: string): { start: string; end: string } | null {
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
        d.getUTCDate(),
      ).padStart(2, '0')}`;
    const lower = text.trim().toLowerCase();
    const uz = this.getUzTime();

    if (lower === 'bugun') {
      const s = fmt(uz);
      return { start: s, end: s };
    }
    if (lower === 'ertaga') {
      const s = fmt(new Date(uz.getTime() + 24 * 60 * 60 * 1000));
      return { start: s, end: s };
    }

    const re = /^\d{4}-\d{2}-\d{2}$/;
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1 && re.test(parts[0])) return { start: parts[0], end: parts[0] };
    if (parts.length === 2 && re.test(parts[0]) && re.test(parts[1])) {
      return { start: parts[0], end: parts[1] };
    }
    return null;
  }

  /** Persist the request via the attendance service and notify admins. */
  private async submitLeaveRequest(
    ctx: Context,
    state: PendingLeave,
    reason?: string,
  ) {
    try {
      const permission = await this.staffAttendanceService.createPermission(
        {
          staff_id: state.staffId,
          type: state.type,
          start_date: state.startDate!,
          end_date: state.endDate!,
          permitted_time: state.permittedTime,
          reason,
        } as any,
        state.staffId,
      );

      const dateLine =
        state.startDate === state.endDate
          ? state.startDate
          : `${state.startDate} — ${state.endDate}`;
      let msg = `✅ Soʻrovingiz yuborildi!\n📋 ${this.leaveTypeLabel(state.type)}\n📅 ${dateLine}`;
      if (state.permittedTime) msg += `\n🕐 ${state.permittedTime}`;
      if (reason) msg += `\n📝 ${reason}`;
      msg += '\n\n⏳ Admin tasdiqlashini kuting.';
      await ctx.reply(msg, Markup.removeKeyboard());

      const staff = await this.userModel.findByPk(state.staffId);
      await this.notifyAdminsOfLeave(permission, staff);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Leave request error for ${state.staffId}: ${message}`);
      await ctx.reply(`❌ Xatolik: ${message}`, Markup.removeKeyboard());
    }
  }

  /** DM every admin the new request with approve / reject buttons. */
  private async notifyAdminsOfLeave(permission: StaffPermission, staff: User | null) {
    const name = staff ? `${staff.first_name} ${staff.last_name}` : permission.staff_id;
    const dateLine =
      permission.start_date === permission.end_date
        ? permission.start_date
        : `${permission.start_date} — ${permission.end_date}`;

    let msg = `🔔 Yangi ruxsat soʻrovi\n\n👤 ${name}\n📋 ${this.leaveTypeLabel(permission.type)}\n📅 ${dateLine}`;
    if (permission.permitted_time) msg += `\n🕐 ${permission.permitted_time}`;
    if (permission.reason) msg += `\n📝 ${permission.reason}`;

    const keyboard = Markup.inlineKeyboard([
      Markup.button.callback('✅ Tasdiqlash', `leave_approve:${permission.id}`),
      Markup.button.callback('❌ Rad etish', `leave_reject:${permission.id}`),
    ]);

    await this.notifyAdmins(msg, keyboard);
  }

  /** Admin approve/reject handler — records the review and notifies the staff. */
  private async reviewLeaveByAdmin(
    ctx: Context,
    permissionId: string,
    decision: 'approved' | 'rejected',
  ) {
    const reviewer = await this.userModel.findOne({
      where: { telegram_chat_id: String(ctx.chat.id) },
    });

    try {
      const permission = await this.staffAttendanceService.reviewPermission(
        permissionId,
        { status: decision } as any,
        reviewer?.user_id,
      );

      const verb = decision === 'approved' ? 'tasdiqlandi ✅' : 'rad etildi ❌';
      const original = (ctx.callbackQuery as any).message?.text ?? '';
      await ctx.editMessageText(`${original}\n\n— Soʻrov ${verb}`);

      const staff = await this.userModel.findByPk(permission.staff_id);
      if (staff?.telegram_chat_id) {
        const dateLine =
          permission.start_date === permission.end_date
            ? permission.start_date
            : `${permission.start_date} — ${permission.end_date}`;
        await this.safeSend(
          staff.telegram_chat_id,
          `📋 Ruxsat soʻrovingiz ${verb}\n${this.leaveTypeLabel(permission.type)}\n📅 ${dateLine}`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Leave review error for ${permissionId}: ${message}`);
      await ctx.reply(`❌ Xatolik: ${message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Reminders & notifications (cron)
  // ---------------------------------------------------------------------------

  /**
   * Every 5 minutes: DM staff ~15 min before their shift starts, and alert
   * admins when a staff member is running late with no approved permission.
   * De-duped per staff+shift+day so each message fires at most once.
   */
  @Cron('0 */5 * * * *')
  async shiftNotificationsCron() {
    const now = this.getUzTime();
    const today = this.getToday();
    this.resetDedupIfNewDay(today);

    const jsDay = now.getUTCDay();
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    const staffList = await this.userModel.findAll({
      where: { telegram_chat_id: { [Op.ne]: null } },
      include: [{ association: 'roles' }],
    });

    for (const staff of staffList) {
      const roleNames = ((staff.roles || []) as any[]).map((r) => r.name as string);
      if (!this.isStaffRoles(roleNames)) continue;

      const chatId = staff.telegram_chat_id;
      if (!chatId) continue;

      const shifts = await this.staffProfileService.resolveShiftsForDay(staff.user_id, jsDay);
      if (shifts.length === 0) continue;

      // Already checked in → nothing to remind or alert about.
      const checkedIn = await StaffAttendance.findOne({
        where: { teacher_id: staff.user_id, date: today, type: 'in' },
      });
      if (checkedIn) continue;

      // Approved permission covering today (full_day excuses entirely).
      const permission = await StaffPermission.findOne({
        where: {
          staff_id: staff.user_id,
          status: 'approved',
          start_date: { [Op.lte]: today },
          end_date: { [Op.gte]: today },
        },
      });
      if (permission?.type === 'full_day') continue;

      for (const shift of shifts) {
        const [h, m] = shift.in_time.split(':').map(Number);
        const startMin = h * 60 + m;
        const grace = shift.grace_period_minutes ?? 0;
        const shiftLabel = shift.name ? `${this.shiftNameLabel(shift.name)} ` : '';

        // Pre-shift reminder: shift starts in the next ~20 minutes.
        const untilStart = startMin - nowMinutes;
        const remindKey = `${today}:${staff.user_id}:${shift.id}`;
        if (untilStart > 0 && untilStart <= 20 && !this.remindersSent.has(remindKey)) {
          this.remindersSent.add(remindKey);
          await this.safeSend(
            chatId,
            `⏰ Eslatma: ${shiftLabel}smenangiz ${shift.in_time.slice(0, 5)} da boshlanadi ` +
              `(${untilStart} daqiqadan keyin).\n\nDavomat uchun /davomat ni bosing.`,
          );
        }

        // Late alert to admins: start + grace passed by >5 min (within an hour),
        // and the staff isn't covered by an approved permission.
        const lateBy = nowMinutes - (startMin + grace);
        const lateKey = `late:${today}:${staff.user_id}:${shift.id}`;
        if (!permission && lateBy > 5 && lateBy <= 60 && !this.lateAlertsSent.has(lateKey)) {
          this.lateAlertsSent.add(lateKey);
          await this.notifyAdmins(
            `⚠️ Kechikish: ${staff.first_name} ${staff.last_name}\n` +
              `${shiftLabel}smena ${shift.in_time.slice(0, 5)} — hali kelmagan ` +
              `(${lateBy} daqiqa oʻtdi).`,
          );
        }
      }
    }
  }

  private resetDedupIfNewDay(today: string) {
    if (this.dedupDate !== today) {
      this.dedupDate = today;
      this.remindersSent.clear();
      this.lateAlertsSent.clear();
    }
  }

  private shiftNameLabel(name: string): string {
    const map: Record<string, string> = { morning: 'Ertalabki', evening: 'Kechki' };
    return map[name] ?? name;
  }

  // ---------------------------------------------------------------------------
  // Messaging helpers
  // ---------------------------------------------------------------------------

  private isStaffRoles(roleNames: string[]): boolean {
    return roleNames.some((r) => AttendanceBotService.STAFF_ROLES.includes(r));
  }

  /** Send a Telegram message, swallowing errors (blocked bot, invalid chat, …). */
  private async safeSend(chatId: string, text: string, extra?: any): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, text, extra);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`sendMessage to ${chatId} failed: ${message}`);
    }
  }

  private async notifyAdmins(text: string, extra?: any): Promise<void> {
    for (const adminId of this.authorizedIds) {
      await this.safeSend(adminId, text, extra);
    }
  }

  // ---------------------------------------------------------------------------
  // Formatting
  // ---------------------------------------------------------------------------

  private formatAttendanceMessage(teacher: User, attendance: StaffAttendance): string {
    const roleNames = ((teacher.roles || []) as any[]).map((r) => r.name as string);
    const roleLine = roleNames.length
      ? roleNames.map((r) => this.roleLabel(r)).join(', ')
      : 'Xodim';

    const statusMap: Record<string, string> = { early: 'VAQLI ✅', on_time: "O'Z VAQTIDA ✅", late: 'KECHIKDI ⚠️' };
    const typeMap: Record<string, string> = { in: 'KIRISH', out: 'CHIQISH' };

    let msg = `✅ Davomat qayd etildi!\n\n`;
    msg += `👤 ${roleLine}: ${teacher.first_name} ${teacher.last_name}\n`;
    msg += `📝 Turi: ${typeMap[attendance.type] || attendance.type.toUpperCase()}\n`;
    msg += `📊 Holati: ${statusMap[attendance.status] || attendance.status}\n`;

    if (attendance.minutes_late > 0) {
      msg += `⏰ Kechikish: ${attendance.minutes_late} daqiqa\n`;
    }
    if (attendance.fine_amount > 0) {
      msg += `💰 Jarima: ${attendance.fine_amount.toLocaleString()} so'm\n`;
    }
    if (attendance.description) {
      msg += `ℹ️ ${attendance.description}`;
    }

    return msg;
  }

  private roleLabel(role: string): string {
    const map: Record<string, string> = {
      admin: 'Admin',
      teacher: "O'qituvchi",
      support_teacher: 'Yordamchi o\'qituvchi',
    };
    return map[role] ?? role;
  }

  // ---------------------------------------------------------------------------
  // Time helpers (Uzbekistan UTC+5)
  // ---------------------------------------------------------------------------

  private getUzTime(): Date {
    return new Date(Date.now() + 5 * 60 * 60 * 1000);
  }

  private getToday(): string {
    const now = this.getUzTime();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
