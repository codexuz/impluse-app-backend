import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Telegraf, Context, Markup } from 'telegraf';
import { User } from '../users/entities/user.entity.js';
import { Group } from '../groups/entities/group.entity.js';
import { StaffAttendanceService } from '../staff-attendance/staff-attendance.service.js';
import { StaffAttendance } from '../staff-attendance/entities/staff-attendance.entity.js';
import { StaffProfileService } from '../staff-profile/staff-profile.service.js';

// Pending GPS verification state: chatId → staffId awaiting location share
type PendingGps = { staffId: string; requestedAt: number };

@Injectable()
export class AttendanceBotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(AttendanceBotService.name);

  // In-memory map — survives only within the process lifetime (fine for a single instance)
  private readonly pendingGps = new Map<string, PendingGps>();
  private readonly GPS_TTL_MS = 3 * 60 * 1000; // 3 minutes to share location

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

      // Cancel button from GPS keyboard
      if (text === '❌ Bekor qilish') {
        this.pendingGps.delete(chatId);
        await ctx.reply('❌ Davomat bekor qilindi.', Markup.removeKeyboard());
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

    const now = this.getUzTime();
    const today = this.getToday();
    const last = await StaffAttendance.findOne({
      where: { teacher_id: staff.user_id, date: today },
      order: [['createdAt', 'DESC']],
    });
    const nextType = last?.type === 'in' ? 'out' : 'in';
    const nextLabel = nextType === 'in' ? 'KIRISH ✅' : 'CHIQISH 🚪';

    // Resolve shift for preview
    const shifts = await this.staffProfileService.resolveShiftsForDay(staff.user_id, now.getUTCDay());
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    let anchorMinutes = nowMinutes;
    if (nextType === 'out' && last?.type === 'in') {
      const checkInUz = new Date(last.createdAt.getTime() + 5 * 60 * 60 * 1000);
      anchorMinutes = checkInUz.getUTCHours() * 60 + checkInUz.getUTCMinutes();
    }
    const shift = this.staffProfileService.pickClosestShift(shifts, anchorMinutes);
    const shiftInfo = shift
      ? `🕐 ${shift.in_time.slice(0, 5)}–${shift.out_time ? shift.out_time.slice(0, 5) : '?'}`
      : '🕐 Smena belgilanmagan';

    this.pendingGps.set(chatId, { staffId: staff.user_id, requestedAt: Date.now() });

    await ctx.reply(
      `👤 ${staff.first_name} ${staff.last_name}\n${shiftInfo}\n📍 Davomat: ${nextLabel}\n\n` +
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
        `✅ GPS tasdiqlandi (${Math.round(distanceM)} m)\n\n${msg}`,
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

    // Determine next scan type from today's last record
    const today = this.getToday();
    const last = await StaffAttendance.findOne({
      where: { teacher_id: teacherId, date: today },
      order: [['createdAt', 'DESC']],
    });
    const nextType = last?.type === 'in' ? 'out' : 'in';
    const nextLabel = nextType === 'in' ? '➡️ Keyingi: KIRISH' : '➡️ Keyingi: CHIQISH';

    // Resolve shift — for checkout preview, anchor to check-in time (mirrors automaticScan logic)
    const shifts = await this.staffProfileService.resolveShiftsForDay(teacherId, now.getUTCDay());
    let anchorMinutes = nowMinutes;
    if (nextType === 'out' && last?.type === 'in') {
      const checkInUz = new Date(last.createdAt.getTime() + 5 * 60 * 60 * 1000);
      anchorMinutes = checkInUz.getUTCHours() * 60 + checkInUz.getUTCMinutes();
    }
    const shift = this.staffProfileService.pickClosestShift(shifts, anchorMinutes);

    let scheduleInfo: string;
    if (shift) {
      scheduleInfo = `🕐 Smena: ${shift.in_time.slice(0, 5)}–${shift.out_time ? shift.out_time.slice(0, 5) : '?'}`;
      if (shift.grace_period_minutes > 0) {
        scheduleInfo += ` (+${shift.grace_period_minutes} daq chegirma)`;
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
