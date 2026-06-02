import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Telegraf, Context, Markup } from 'telegraf';
import { User } from '../users/entities/user.entity.js';
import { StaffAttendanceService } from '../staff-attendance/staff-attendance.service.js';
import { StaffAttendance } from '../staff-attendance/entities/staff-attendance.entity.js';
import { StaffProfileService } from '../staff-profile/staff-profile.service.js';

@Injectable()
export class AttendanceBotService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(AttendanceBotService.name);

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
      if (payload) {
        await this.promptScanType(ctx, payload.trim());
      } else {
        await ctx.reply(
          'Xodimlar davomati botiga xush kelibsiz.\n\nO\'qituvchining QR kodini skanerlang yoki UUID ni yuboring.',
        );
      }
    });

    // /today <teacherId> — today's attendance summary for a teacher
    this.bot.command('today', async (ctx) => {
      if (!this.isAuthorized(String(ctx.chat.id))) return this.replyUnauthorized(ctx);
      const parts = ctx.message.text.split(' ');
      const id = parts[1]?.trim();
      if (!id) return ctx.reply('Foydalanish: /today <teacher_id>');
      await this.sendTodaySummary(ctx, id);
    });

    // Callback: in/out button presses
    this.bot.on('callback_query', async (ctx) => {
      if (!this.isAuthorized(String(ctx.chat.id))) return this.replyUnauthorized(ctx);
      const data = (ctx.callbackQuery as any).data as string;
      // format: "scan:<teacherId>:<in|out>"
      if (data?.startsWith('scan:')) {
        const [, teacherId, scanType] = data.split(':');
        await ctx.answerCbQuery();
        await this.recordAttendance(ctx, teacherId, scanType as 'in' | 'out');
      }
    });

    // Plain text / UUID message
    this.bot.on('message', async (ctx) => {
      if (!this.isAuthorized(String(ctx.chat.id))) return this.replyUnauthorized(ctx);
      const text = ((ctx.message as any).text as string | undefined)?.trim();
      if (!text) return;
      await this.promptScanType(ctx, text);
    });
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

    const teacher = await this.userModel.findByPk(teacherId);
    if (!teacher) return ctx.reply('Foydalanuvchi topilmadi.');

    const name = `${teacher.first_name} ${teacher.last_name}`;
    const now = this.getUzTime();
    const shift = await this.staffProfileService.resolveShiftsForDay(teacherId, now.getUTCDay())
      .then((shifts) => this.staffProfileService.pickClosestShift(shifts, now.getUTCHours() * 60 + now.getUTCMinutes()));

    const shiftInfo = shift
      ? `🕐 Shift: ${shift.in_time.slice(0, 5)}–${shift.out_time ? shift.out_time.slice(0, 5) : '?'}`
      : '🕐 Shift belgilanmagan';

    return ctx.reply(
      `👤 ${name}\n${shiftInfo}\n\nDavomat turini tanlang:`,
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
    const isAdmin = (teacher.roles || []).some((r: any) => r.name === 'admin');
    const roleLabel = isAdmin ? 'Admin' : "O'qituvchi";
    const statusMap: Record<string, string> = { early: 'VAQLI ✅', on_time: "O'Z VAQTIDA ✅", late: 'KECHIKDI ⚠️' };
    const typeMap: Record<string, string> = { in: 'KIRISH', out: 'CHIQISH' };

    let msg = `✅ Davomat qayd etildi!\n\n`;
    msg += `👤 ${roleLabel}: ${teacher.first_name} ${teacher.last_name}\n`;
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
