import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron } from "@nestjs/schedule";
import { Telegraf, Context, Markup } from "telegraf";
import { User } from "../users/entities/user.entity.js";
import { SupportAssignmentsService } from "../support-assignments/support-assignments.service.js";
import { SupportAttendanceService } from "../support-attendance/support-attendance.service.js";
import { GroupStudentsService } from "../group-students/group-students.service.js";

type AttStatus = "present" | "absent" | "late";

interface SessionStudent {
  id: string;
  name: string;
  status?: AttStatus;
  /** Whether this status was already saved (taken) before this session. */
  taken: boolean;
}

interface AttendanceSession {
  supportTeacherId: string;
  assignmentId?: string;
  groupId: string;
  groupName: string;
  date: string; // YYYY-MM-DD
  students: SessionStudent[];
  page: number;
}

const DAY_LABEL: Record<string, string> = {
  odd: "Toq kunlar",
  even: "Juft kunlar",
  every_day: "Har kuni",
  other_day: "Boshqa kunlar",
};

const WEEKDAYS_UZ = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

const PAGE_SIZE = 8;
const DATE_CHOICES = 7; // how many recent days to offer when picking a date

@Injectable()
export class SupportBotService implements OnModuleInit {
  private bot: Telegraf | null = null;
  private readonly logger = new Logger(SupportBotService.name);

  // In-memory marking sessions, keyed by Telegram chatId (single-instance only)
  private readonly sessions = new Map<string, AttendanceSession>();

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly supportAssignmentsService: SupportAssignmentsService,
    private readonly supportAttendanceService: SupportAttendanceService,
    private readonly groupStudentsService: GroupStudentsService,
  ) {
    const token = process.env.SUPPORT_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    } else {
      this.logger.warn(
        "SUPPORT_BOT_TOKEN is not set — Support Bot is disabled.",
      );
    }
  }

  async onModuleInit() {
    if (!this.bot) return;
    this.registerCommands();

    try {
      await this.bot.telegram.setMyCommands([
        { command: "start", description: "Botni ishga tushirish" },
        { command: "davomat", description: "Guruhlar davomatini olish" },
        { command: "link", description: "Hisobni bog'lash: /link <login>" },
      ]);

      const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
      if (webhookUrl) {
        const path = `/api/support-bot/webhook`;
        await this.bot.telegram.setWebhook(`${webhookUrl}${path}`);
        this.logger.log(`Support Bot webhook set to: ${webhookUrl}${path}`);
      } else {
        this.bot.launch();
        this.logger.log("Support Bot started in polling mode");
      }
    } catch (error) {
      this.logger.error("Failed to initialize Support Bot", error as any);
    }

    this.logger.log("Support Bot Service initialized");
  }

  getBotInstance(): Telegraf | null {
    return this.bot;
  }

  // ---------------------------------------------------------------------------
  // Command / callback registration
  // ---------------------------------------------------------------------------

  private registerCommands() {
    if (!this.bot) return;

    this.bot.start(async (ctx) => {
      const teacher = await this.findLinkedSupportTeacher(String(ctx.chat.id));
      if (!teacher) {
        await ctx.reply(
          "Support davomati botiga xush kelibsiz.\n\n" +
            "Hisobingiz hali bog'lanmagan. Bog'lash uchun:\n" +
            "/link <login>\nMisol: /link sardor_aliyev",
        );
        return;
      }
      await this.showGroups(ctx, teacher);
    });

    // /link <login>
    this.bot.command("link", async (ctx) => {
      const parts = ctx.message.text.split(" ");
      const username = parts[1]?.trim();
      if (!username) {
        await ctx.reply("Foydalanish: /link <login>\nMisol: /link sardor_aliyev");
        return;
      }
      const user = await this.userModel.findOne({
        where: { username },
        include: [{ association: "roles" }],
      });
      if (!user) {
        await ctx.reply(`❌ "${username}" logini bilan foydalanuvchi topilmadi.`);
        return;
      }
      const roleNames = ((user.roles || []) as any[]).map((r) => r.name as string);
      if (!roleNames.includes("support_teacher")) {
        await ctx.reply("❌ Faqat support o'qituvchilar bog'lanishi mumkin.");
        return;
      }
      await user.update({ telegram_chat_id: String(ctx.chat.id) });
      await ctx.reply(
        `✅ Hisobingiz bog'landi!\n👤 ${user.first_name} ${user.last_name}\n\n` +
          "Guruhlaringizni ko'rish uchun /davomat buyrug'ini bosing.",
      );
    });

    // /davomat — list groups
    this.bot.command("davomat", async (ctx) => {
      const teacher = await this.findLinkedSupportTeacher(String(ctx.chat.id));
      if (!teacher) {
        await ctx.reply("Hisobingiz bog'lanmagan. /link <login> orqali bog'lang.");
        return;
      }
      await this.showGroups(ctx, teacher);
    });

    this.bot.on("callback_query", async (ctx) => {
      const chatId = String(ctx.chat.id);
      const data = (ctx.callbackQuery as any).data as string;
      try {
        await ctx.answerCbQuery();
      } catch {
        /* ignore */
      }

      if (!data || data === "noop") return;

      const teacher = await this.findLinkedSupportTeacher(chatId);
      if (!teacher) {
        await ctx.reply("Hisobingiz bog'lanmagan. /link <login> orqali bog'lang.");
        return;
      }

      // asg:<assignmentId> → choose a date
      if (data.startsWith("asg:")) {
        await this.promptDate(ctx, data.slice(4));
        return;
      }

      // sd:<assignmentId>:<YYYY-MM-DD> → open checklist for that date
      if (data.startsWith("sd:")) {
        const [, assignmentId, date] = data.split(":");
        await this.startSession(ctx, teacher, assignmentId, date);
        return;
      }

      // t:<absIndex>:<p|a> → toggle a student's status
      if (data.startsWith("t:")) {
        await this.handleToggle(ctx, chatId, data);
        return;
      }

      // pg:<page> → change checklist page
      if (data.startsWith("pg:")) {
        const session = this.sessions.get(chatId);
        if (session) {
          session.page = Number(data.slice(3)) || 0;
          await this.renderChecklist(ctx, session, true);
        }
        return;
      }

      // nav:date → re-pick the date for the current session
      if (data === "nav:date") {
        const session = this.sessions.get(chatId);
        if (session?.assignmentId) await this.promptDate(ctx, session.assignmentId);
        return;
      }

      if (data === "nav:groups") {
        await this.showGroups(ctx, teacher, true);
        return;
      }

      if (data === "nav:save") {
        await this.handleSave(ctx, chatId);
        return;
      }

      if (data === "nav:cancel") {
        this.sessions.delete(chatId);
        await this.safeEdit(ctx, "❌ Davomat bekor qilindi.");
        return;
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Group listing
  // ---------------------------------------------------------------------------

  private async showGroups(ctx: Context, teacher: User, edit = false) {
    const active = await this.activeAssignments(teacher.user_id);

    if (active.length === 0) {
      const msg =
        `👤 ${teacher.first_name} ${teacher.last_name}\n\n` +
        "Sizga biriktirilgan faol guruh topilmadi.";
      if (edit) await this.safeEdit(ctx, msg);
      else await ctx.reply(msg);
      return;
    }

    const buttons = active.map((a: any) => {
      const groupName = a.group?.name || "Guruh";
      const days = a.days ? DAY_LABEL[a.days] : "";
      const time =
        a.start_time && a.end_time
          ? `${String(a.start_time).slice(0, 5)}-${String(a.end_time).slice(0, 5)}`
          : "";
      const meta = [days, time].filter(Boolean).join(" • ");
      const label = meta ? `${groupName} (${meta})` : groupName;
      return [Markup.button.callback(label, `asg:${a.id}`)];
    });

    const text =
      `👤 ${teacher.first_name} ${teacher.last_name}\n\n` + "📋 Guruhni tanlang:";
    const keyboard = Markup.inlineKeyboard(buttons);

    if (edit) await this.safeEdit(ctx, text, keyboard);
    else await ctx.reply(text, keyboard);
  }

  // ---------------------------------------------------------------------------
  // Date selection
  // ---------------------------------------------------------------------------

  private async promptDate(ctx: Context, assignmentId: string) {
    const rows = [];
    for (let i = 0; i < DATE_CHOICES; i++) {
      const date = this.dateInTashkent(-i);
      const dm = this.shortDate(date);
      const wd = this.weekdayUz(date);
      const label =
        i === 0
          ? `Bugun, ${wd} (${dm})`
          : i === 1
            ? `Kecha, ${wd} (${dm})`
            : `${wd} (${dm})`;
      rows.push([Markup.button.callback(label, `sd:${assignmentId}:${date}`)]);
    }
    rows.push([Markup.button.callback("⬅️ Guruhlar", "nav:groups")]);

    await this.safeEdit(
      ctx,
      "📅 Davomat sanasini tanlang:",
      Markup.inlineKeyboard(rows),
    );
  }

  // ---------------------------------------------------------------------------
  // Attendance checklist
  // ---------------------------------------------------------------------------

  private async startSession(
    ctx: Context,
    teacher: User,
    assignmentId: string,
    date: string,
  ) {
    const active = await this.activeAssignments(teacher.user_id);
    const assignment = active.find((a: any) => a.id === assignmentId) as any;
    if (!assignment) {
      await this.safeEdit(ctx, "❌ Biriktirish topilmadi yoki sizga tegishli emas.");
      return;
    }

    const groupStudents = await this.groupStudentsService.findByGroupId(
      assignment.group_id,
    );
    if (!groupStudents.length) {
      await this.safeEdit(ctx, "Bu guruhda faol talabalar yo'q.");
      return;
    }

    // Pre-fill statuses from attendance already taken for this date
    const existing = await this.supportAttendanceService.findAll({
      group_id: assignment.group_id,
      startDate: date,
      endDate: date,
    });
    const existingMap = new Map<string, AttStatus>(
      existing.map((r: any) => [r.student_id, r.status as AttStatus]),
    );

    const students: SessionStudent[] = groupStudents.map((gs: any) => {
      const prev = existingMap.get(gs.student.user_id);
      return {
        id: gs.student.user_id,
        name: `${gs.student.first_name} ${gs.student.last_name}`.trim(),
        status: prev,
        taken: !!prev,
      };
    });

    const session: AttendanceSession = {
      supportTeacherId: teacher.user_id,
      assignmentId: assignment.id,
      groupId: assignment.group_id,
      groupName: assignment.group?.name || "Guruh",
      date,
      students,
      page: 0,
    };
    this.sessions.set(String(ctx.chat.id), session);

    await this.renderChecklist(ctx, session, true);
  }

  private async handleToggle(ctx: Context, chatId: string, data: string) {
    const session = this.sessions.get(chatId);
    if (!session) {
      await this.safeEdit(ctx, "Sessiya tugagan. /davomat ni qayta bosing.");
      return;
    }

    const [, idxRaw, mark] = data.split(":");
    const idx = Number(idxRaw);
    const student = session.students[idx];
    if (!student) return;

    const next: AttStatus = mark === "p" ? "present" : "absent";
    // Tapping the already-selected status clears it (back to unmarked)
    student.status = student.status === next ? undefined : next;

    await this.renderChecklist(ctx, session, true);
  }

  private async handleSave(ctx: Context, chatId: string) {
    const session = this.sessions.get(chatId);
    if (!session) {
      await this.safeEdit(ctx, "Sessiya tugagan. /davomat ni qayta bosing.");
      return;
    }

    const records = session.students
      .filter((s) => s.status)
      .map((s) => ({ student_id: s.id, status: s.status as AttStatus }));

    if (records.length === 0) {
      await this.safeEdit(ctx, "⚠️ Hech bir talaba belgilanmadi. Saqlanmadi.");
      this.sessions.delete(chatId);
      return;
    }

    try {
      const result = await this.supportAttendanceService.markBulk({
        assignment_id: session.assignmentId,
        support_teacher_id: session.supportTeacherId,
        group_id: session.groupId,
        date: session.date,
        records: records as any,
      });

      this.sessions.delete(chatId);
      await this.safeEdit(
        ctx,
        `✅ Davomat saqlandi!\n\n` +
          `👥 ${session.groupName}\n📅 ${session.date}\n` +
          `📝 Jami: ${result.total} • Yangi: ${result.created} • Yangilangan: ${result.updated}`,
      );
    } catch (error: any) {
      this.logger.error("Failed to save support attendance", error);
      await this.safeEdit(
        ctx,
        `❌ Saqlashda xatolik: ${error?.message || "noma'lum xato"}`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  /** Icon shown next to a student's name for their current status. */
  private statusIcon(status?: AttStatus): string {
    if (status === "present") return "✅";
    if (status === "absent") return "❌";
    return "➖";
  }

  private async renderChecklist(
    ctx: Context,
    session: AttendanceSession,
    edit: boolean,
  ) {
    const total = session.students.length;
    const present = session.students.filter((s) => s.status === "present").length;
    const absent = session.students.filter((s) => s.status === "absent").length;
    const unmarked = total - present - absent;
    const alreadyTaken = session.students.some((s) => s.taken);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (session.page >= totalPages) session.page = totalPages - 1;
    if (session.page < 0) session.page = 0;
    const startIdx = session.page * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, total);

    const pageInfo =
      totalPages > 1 ? `\n📄 Sahifa ${session.page + 1}/${totalPages}` : "";

    const header =
      `👥 ${session.groupName} — 📅 ${session.date}\n` +
      (alreadyTaken ? "♻️ Bu sana uchun davomat olingan (tahrirlash mumkin)\n" : "") +
      `\n✅ Keldi: ${present}  ❌ Kelmadi: ${absent}  ➖ Qolgan: ${unmarked}` +
      pageInfo +
      `\n\nHar bir talaba uchun ✅ yoki ❌ ni bosing:`;

    // One row per student on the current page: [icon Name] [✅] [❌]
    const rows: any[] = [];
    for (let i = startIdx; i < endIdx; i++) {
      const s = session.students[i];
      rows.push([
        Markup.button.callback(`${this.statusIcon(s.status)} ${s.name}`, "noop"),
        Markup.button.callback(s.status === "present" ? "✅·" : "✅", `t:${i}:p`),
        Markup.button.callback(s.status === "absent" ? "❌·" : "❌", `t:${i}:a`),
      ]);
    }

    // Pagination controls
    if (totalPages > 1) {
      const navRow: any[] = [];
      if (session.page > 0)
        navRow.push(Markup.button.callback("◀️", `pg:${session.page - 1}`));
      navRow.push(
        Markup.button.callback(`${session.page + 1}/${totalPages}`, "noop"),
      );
      if (session.page < totalPages - 1)
        navRow.push(Markup.button.callback("▶️", `pg:${session.page + 1}`));
      rows.push(navRow);
    }

    rows.push([
      Markup.button.callback("💾 Saqlash", "nav:save"),
      Markup.button.callback("📅 Sana", "nav:date"),
    ]);
    rows.push([
      Markup.button.callback("⬅️ Guruhlar", "nav:groups"),
      Markup.button.callback("✖️ Bekor qilish", "nav:cancel"),
    ]);

    const keyboard = Markup.inlineKeyboard(rows);
    if (edit) await this.safeEdit(ctx, header, keyboard);
    else await ctx.reply(header, keyboard);
  }

  // ---------------------------------------------------------------------------
  // Daily reminder cron
  // ---------------------------------------------------------------------------

  /**
   * Every morning, remind each linked support teacher about the groups they
   * need to take attendance for today (based on each assignment's days pattern).
   * The reminder includes a button per group that jumps straight into marking.
   */
  @Cron("0 8 * * *", { timeZone: "Asia/Tashkent" })
  async sendDailyReminders() {
    if (!this.bot) return;
    try {
      const today = this.dateInTashkent(0);
      const weekday = this.weekdayNum(today);

      const all = await this.supportAssignmentsService.findAll();
      const todays = all.filter(
        (a: any) => a.is_active && this.assignmentRunsOn(a.days, weekday),
      );
      if (!todays.length) return;

      // Group today's assignments by support teacher
      const byTeacher = new Map<string, any[]>();
      for (const a of todays as any[]) {
        const list = byTeacher.get(a.support_teacher_id) || [];
        list.push(a);
        byTeacher.set(a.support_teacher_id, list);
      }

      // Resolve Telegram chat ids for those teachers
      const teacherIds = [...byTeacher.keys()];
      const users = await this.userModel.findAll({
        where: { user_id: teacherIds },
        attributes: ["user_id", "telegram_chat_id", "first_name"],
      });
      const chatMap = new Map(
        users
          .filter((u) => u.telegram_chat_id)
          .map((u) => [u.user_id, u.telegram_chat_id as string]),
      );

      for (const [teacherId, list] of byTeacher) {
        const chatId = chatMap.get(teacherId);
        if (!chatId) continue;

        const buttons = list.map((a: any) => [
          Markup.button.callback(a.group?.name || "Guruh", `asg:${a.id}`),
        ]);
        const text =
          `🔔 Eslatma!\nBugun (${this.weekdayUz(today)}, ${this.shortDate(today)}) ` +
          `quyidagi guruh(lar) uchun davomat olishingiz kerak:\n\nGuruhni tanlang:`;

        try {
          await this.bot.telegram.sendMessage(
            chatId,
            text,
            Markup.inlineKeyboard(buttons),
          );
        } catch (err) {
          this.logger.warn(
            `Failed to send reminder to teacher ${teacherId}: ${(err as any)?.message}`,
          );
        }
      }

      this.logger.log(
        `Support attendance reminders sent for ${today} (${byTeacher.size} teacher group(s))`,
      );
    } catch (error) {
      this.logger.error("Daily support reminder failed", error as any);
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** Active assignments for a teacher (eager-loads teacher + group). */
  private async activeAssignments(teacherId: string): Promise<any[]> {
    const assignments =
      await this.supportAssignmentsService.findByTeacher(teacherId);
    return (assignments as any[]).filter((a) => a.is_active);
  }

  private async findLinkedSupportTeacher(chatId: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { telegram_chat_id: chatId },
      include: [{ association: "roles" }],
    });
    if (!user) return null;
    const roleNames = ((user.roles || []) as any[]).map((r) => r.name as string);
    return roleNames.includes("support_teacher") ? user : null;
  }

  /** Does an assignment's days pattern include the given weekday (0=Sun..6=Sat)? */
  private assignmentRunsOn(days: string | null | undefined, weekday: number): boolean {
    if (!days) return false; // no schedule → don't remind
    if (days === "every_day" || days === "other_day") return true;
    if (days === "odd") return [1, 3, 5].includes(weekday); // Mon, Wed, Fri
    if (days === "even") return [2, 4, 6].includes(weekday); // Tue, Thu, Sat
    return false;
  }

  /** Current date in Asia/Tashkent (UTC+5) as YYYY-MM-DD, optionally offset by days. */
  private dateInTashkent(offsetDays = 0): string {
    const base = new Date(Date.now() + offsetDays * 86400000);
    // en-CA formats as YYYY-MM-DD
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(base);
  }

  /** YYYY-MM-DD → DD.MM */
  private shortDate(dateStr: string): string {
    const [, m, d] = dateStr.split("-");
    return `${d}.${m}`;
  }

  /** Uzbek short weekday name for a YYYY-MM-DD calendar date. */
  private weekdayUz(dateStr: string): string {
    return WEEKDAYS_UZ[this.weekdayNum(dateStr)];
  }

  private weekdayNum(dateStr: string): number {
    return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
  }

  /** Edit the message in place when possible, otherwise send a fresh reply. */
  private async safeEdit(ctx: Context, text: string, keyboard?: any) {
    try {
      await ctx.editMessageText(text, keyboard);
    } catch {
      await ctx.reply(text, keyboard);
    }
  }
}
