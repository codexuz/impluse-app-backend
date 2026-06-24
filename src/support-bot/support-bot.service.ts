import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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
}

interface AttendanceSession {
  supportTeacherId: string;
  assignmentId?: string;
  groupId: string;
  groupName: string;
  date: string; // YYYY-MM-DD
  students: SessionStudent[];
  index: number;
}

const STATUS_LABEL: Record<AttStatus, string> = {
  present: "✅ Keldi",
  absent: "❌ Kelmadi",
  late: "⏰ Kechikdi",
};

const DAY_LABEL: Record<string, string> = {
  odd: "Toq kunlar",
  even: "Juft kunlar",
  every_day: "Har kuni",
  other_day: "Boshqa kunlar",
};

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
      await this.showAssignments(ctx, teacher);
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
          "Davomat olish uchun /davomat buyrug'ini bosing.",
      );
    });

    // /davomat — list assignments
    this.bot.command("davomat", async (ctx) => {
      const teacher = await this.findLinkedSupportTeacher(String(ctx.chat.id));
      if (!teacher) {
        await ctx.reply("Hisobingiz bog'lanmagan. /link <login> orqali bog'lang.");
        return;
      }
      await this.showAssignments(ctx, teacher);
    });

    this.bot.on("callback_query", async (ctx) => {
      const chatId = String(ctx.chat.id);
      const data = (ctx.callbackQuery as any).data as string;
      try {
        await ctx.answerCbQuery();
      } catch {
        /* ignore */
      }

      if (!data) return;

      const teacher = await this.findLinkedSupportTeacher(chatId);
      if (!teacher) {
        await ctx.reply("Hisobingiz bog'lanmagan. /link <login> orqali bog'lang.");
        return;
      }

      // asg:<assignmentId> → choose date
      if (data.startsWith("asg:")) {
        const assignmentId = data.slice(4);
        await this.promptDate(ctx, assignmentId);
        return;
      }

      // day:<assignmentId>:<t|y> → start session
      if (data.startsWith("day:")) {
        const [, assignmentId, when] = data.split(":");
        const date = when === "y" ? this.dateInTashkent(-1) : this.dateInTashkent(0);
        await this.startSession(ctx, teacher, assignmentId, date);
        return;
      }

      // m:<present|absent|late|skip> → record and advance
      if (data.startsWith("m:")) {
        const status = data.slice(2);
        await this.handleMark(ctx, chatId, status);
        return;
      }

      if (data === "nav:back") {
        await this.handleBack(ctx, chatId);
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
  // Assignment listing
  // ---------------------------------------------------------------------------

  private async showAssignments(ctx: Context, teacher: User) {
    const assignments = await this.supportAssignmentsService.findByTeacher(
      teacher.user_id,
    );
    const active = assignments.filter((a: any) => a.is_active);

    if (active.length === 0) {
      await ctx.reply(
        `👤 ${teacher.first_name} ${teacher.last_name}\n\n` +
          "Sizga biriktirilgan faol guruh topilmadi.",
      );
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

    await ctx.reply(
      `👤 ${teacher.first_name} ${teacher.last_name}\n\n` +
        "📋 Davomat olish uchun guruhni tanlang:",
      Markup.inlineKeyboard(buttons),
    );
  }

  private async promptDate(ctx: Context, assignmentId: string) {
    await this.safeEdit(
      ctx,
      "📅 Sanani tanlang:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Bugun", `day:${assignmentId}:t`),
          Markup.button.callback("Kecha", `day:${assignmentId}:y`),
        ],
      ]),
    );
  }

  // ---------------------------------------------------------------------------
  // Marking session
  // ---------------------------------------------------------------------------

  private async startSession(
    ctx: Context,
    teacher: User,
    assignmentId: string,
    date: string,
  ) {
    // Re-fetch the teacher's assignments and confirm ownership of this one
    const assignments = await this.supportAssignmentsService.findByTeacher(
      teacher.user_id,
    );
    const assignment = assignments.find((a: any) => a.id === assignmentId) as any;
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

    // Pre-fill statuses from any attendance already recorded for this date
    const existing = await this.supportAttendanceService.findAll({
      group_id: assignment.group_id,
      startDate: date,
      endDate: date,
    });
    const existingMap = new Map<string, AttStatus>(
      existing.map((r: any) => [r.student_id, r.status as AttStatus]),
    );

    const students: SessionStudent[] = groupStudents.map((gs: any) => ({
      id: gs.student.user_id,
      name: `${gs.student.first_name} ${gs.student.last_name}`.trim(),
      status: existingMap.get(gs.student.user_id),
    }));

    const session: AttendanceSession = {
      supportTeacherId: teacher.user_id,
      assignmentId: assignment.id,
      groupId: assignment.group_id,
      groupName: assignment.group?.name || "Guruh",
      date,
      students,
      index: 0,
    };
    this.sessions.set(String(ctx.chat.id), session);

    await this.sendStudentPrompt(ctx, session, true);
  }

  private async handleMark(ctx: Context, chatId: string, status: string) {
    const session = this.sessions.get(chatId);
    if (!session) {
      await this.safeEdit(ctx, "Sessiya tugagan. /davomat ni qayta bosing.");
      return;
    }

    // Stale button press after the summary was already shown
    if (session.index >= session.students.length) {
      await this.sendSummary(ctx, session);
      return;
    }

    if (status !== "skip") {
      session.students[session.index].status = status as AttStatus;
    }
    session.index += 1;

    if (session.index >= session.students.length) {
      await this.sendSummary(ctx, session);
    } else {
      await this.sendStudentPrompt(ctx, session, true);
    }
  }

  private async handleBack(ctx: Context, chatId: string) {
    const session = this.sessions.get(chatId);
    if (!session) {
      await this.safeEdit(ctx, "Sessiya tugagan. /davomat ni qayta bosing.");
      return;
    }
    if (session.index > 0) session.index -= 1;
    // If we were on the summary screen, index already equals length → step back in
    if (session.index >= session.students.length) {
      session.index = session.students.length - 1;
    }
    await this.sendStudentPrompt(ctx, session, true);
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

  private async sendStudentPrompt(
    ctx: Context,
    session: AttendanceSession,
    edit: boolean,
  ) {
    const student = session.students[session.index];
    const current = student.status ? `\nJoriy: ${STATUS_LABEL[student.status]}` : "";
    const text =
      `👥 ${session.groupName} — 📅 ${session.date}\n` +
      `Talaba ${session.index + 1}/${session.students.length}\n\n` +
      `👤 ${student.name}${current}`;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("✅ Keldi", "m:present"),
        Markup.button.callback("❌ Kelmadi", "m:absent"),
        Markup.button.callback("⏰ Kechikdi", "m:late"),
      ],
      [
        Markup.button.callback("⏭ O'tkazib yuborish", "m:skip"),
        ...(session.index > 0
          ? [Markup.button.callback("⬅️ Orqaga", "nav:back")]
          : []),
      ],
      [Markup.button.callback("✖️ Bekor qilish", "nav:cancel")],
    ]);

    if (edit) {
      await this.safeEdit(ctx, text, keyboard);
    } else {
      await ctx.reply(text, keyboard);
    }
  }

  private async sendSummary(ctx: Context, session: AttendanceSession) {
    const counts = { present: 0, absent: 0, late: 0, skipped: 0 };
    session.students.forEach((s) => {
      if (s.status) counts[s.status] += 1;
      else counts.skipped += 1;
    });

    const lines = session.students
      .map(
        (s, i) =>
          `${i + 1}. ${s.name} — ${s.status ? STATUS_LABEL[s.status] : "➖ Belgilanmagan"}`,
      )
      .join("\n");

    const text =
      `📋 Yakuniy ko'rib chiqish\n👥 ${session.groupName} — 📅 ${session.date}\n\n` +
      `✅ Keldi: ${counts.present}  ❌ Kelmadi: ${counts.absent}  ⏰ Kechikdi: ${counts.late}\n` +
      `➖ Belgilanmagan: ${counts.skipped}\n\n${lines}`;

    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("💾 Saqlash", "nav:save"),
        Markup.button.callback("⬅️ Orqaga", "nav:back"),
      ],
      [Markup.button.callback("✖️ Bekor qilish", "nav:cancel")],
    ]);

    await this.safeEdit(ctx, text, keyboard);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async findLinkedSupportTeacher(chatId: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { telegram_chat_id: chatId },
      include: [{ association: "roles" }],
    });
    if (!user) return null;
    const roleNames = ((user.roles || []) as any[]).map((r) => r.name as string);
    return roleNames.includes("support_teacher") ? user : null;
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

  /** Edit the message in place when possible, otherwise send a fresh reply. */
  private async safeEdit(ctx: Context, text: string, keyboard?: any) {
    try {
      await ctx.editMessageText(text, keyboard);
    } catch {
      await ctx.reply(text, keyboard);
    }
  }
}
