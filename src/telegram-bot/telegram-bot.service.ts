import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Telegraf, Context } from "telegraf";
import { Op } from "sequelize";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { Grading } from "../gradings/entities/grading.entity.js";
import { Exam } from "../exams/entities/exam.entity.js";
import { ExamResult } from "../exams/entities/exam_result.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";
import { StudentPaymentService } from "../student-payment/student-payment.service.js";
import { CoursesService } from "../courses/courses.service.js";

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramBotService.name);
  /** Track last bot message per chat so we can delete it when a new command arrives */
  private lastBotMessage = new Map<string, number>();

  constructor(
    @InjectModel(StudentParent)
    private readonly studentParentModel: typeof StudentParent,
    @InjectModel(StudentPayment)
    private readonly studentPaymentModel: typeof StudentPayment,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(Grading)
    private readonly gradingModel: typeof Grading,
    @InjectModel(Exam)
    private readonly examModel: typeof Exam,
    @InjectModel(ExamResult)
    private readonly examResultModel: typeof ExamResult,
    @InjectModel(StudentProfile)
    private readonly studentProfileModel: typeof StudentProfile,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Group)
    private readonly groupModel: typeof Group,
    @InjectModel(GroupStudent)
    private readonly groupStudentModel: typeof GroupStudent,
    @InjectModel(StudentWallet)
    private readonly studentWalletModel: typeof StudentWallet,
    private readonly studentPaymentService: StudentPaymentService,
    private readonly coursesService: CoursesService,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn("TELEGRAM_BOT_TOKEN is not set. Bot will not start.");
    }
    this.bot = new Telegraf(token || "dummy");
  }

  async onModuleInit() {
    if (!process.env.TELEGRAM_BOT_TOKEN) return;

    this.registerCommands();

    // Set webhook if TELEGRAM_WEBHOOK_URL is provided, otherwise use polling
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    if (webhookUrl) {
      const webhookPath = `/api/telegram-bot/webhook`;
      await this.bot.telegram.setWebhook(`${webhookUrl}${webhookPath}`);
      this.logger.log(`Telegram webhook set to: ${webhookUrl}${webhookPath}`);
    } else {
      // Fallback to polling for local development
      this.bot.launch();
      this.logger.log("Telegram bot started in polling mode");
    }
  }

  async onModuleDestroy() {
    this.bot.stop("Application shutdown");
  }

  /** Expose bot instance for webhook handling */
  getBotInstance(): Telegraf {
    return this.bot;
  }

  private registerCommands() {
    // Set bot command menu
    this.bot.telegram.setMyCommands([
      { command: "start", description: "🚀 Botni ishga tushirish" },
      { command: "menu", description: "📋 Asosiy menyu" },
      { command: "payments", description: "💰 To'lovlar" },
      { command: "attendance", description: "📅 Davomat" },
      { command: "grades", description: "📊 Baholar" },
      { command: "exams", description: "📝 Imtihon natijalari" },
      { command: "progress", description: "📈 O'quv jarayoni" },
      { command: "profile", description: "👤 Profil" },
      { command: "unlink", description: "🔓 Profilni uzish" },
      { command: "help", description: "❓ Yordam" },
    ]);

    this.bot.command("start", (ctx) => this.handleStart(ctx));
    this.bot.command("menu", (ctx) => this.handleMenu(ctx));
    this.bot.command("payments", (ctx) => this.handlePayments(ctx));
    this.bot.command("attendance", (ctx) => this.handleAttendance(ctx));
    this.bot.command("grades", (ctx) => this.handleGrades(ctx));
    this.bot.command("exams", (ctx) => this.handleExams(ctx));
    this.bot.command("progress", (ctx) => this.handleProgress(ctx));
    this.bot.command("profile", (ctx) => this.handleProfile(ctx));
    this.bot.command("unlink", (ctx) => this.handleUnlink(ctx));
    this.bot.command("help", (ctx) => this.handleHelp(ctx));

    // Handle callback queries from inline keyboards
    this.bot.on("callback_query", (ctx) => this.handleCallbackQuery(ctx));

    // Handle phone number sharing for linking
    this.bot.on("message", (ctx) => this.handleContactMessage(ctx));
  }

  // ─── Helpers: delete previous bot message & send with tracking ─────
  private async deleteOldBotMessage(chatId: string) {
    const prevId = this.lastBotMessage.get(chatId);
    if (prevId) {
      try {
        await this.bot.telegram.deleteMessage(Number(chatId), prevId);
      } catch {
        // Message may already be deleted or too old – ignore
      }
      this.lastBotMessage.delete(chatId);
    }
  }

  /** Send a reply, delete the previous bot message, and track the new one */
  private async sendAndTrack(
    ctx: Context,
    text: string,
    extra?: any,
  ) {
    const chatId = String(ctx.chat!.id);
    await this.deleteOldBotMessage(chatId);
    // Also try to delete the user's command message to keep chat clean
    try {
      await ctx.deleteMessage();
    } catch {
      // May lack permission in groups – ignore
    }
    const sent = await ctx.reply(text, extra);
    this.lastBotMessage.set(chatId, sent.message_id);
    return sent;
  }

  // ─── /start ────────────────────────────────────────────────
  private async handleStart(ctx: Context) {
    const chatId = String(ctx.chat!.id);

    // Check if already linked
    const parent = await this.studentParentModel.findOne({
      where: { telegram_chat_id: chatId },
    });

    if (parent) {
      return this.sendAndTrack(
        ctx,
        `✅ Siz allaqachon ro'yxatdan o'tgansiz!\n\n👤 Ism: ${parent.full_name}\n\n📋 Menyu uchun /menu bosing.`,
      );
    }

    return this.sendAndTrack(
      ctx,
      `👋 Assalomu alaykum! Impulse o'quv markazi botiga xush kelibsiz.\n\n` +
        `Farzandingiz haqidagi ma'lumotlarni ko'rish uchun telefon raqamingizni yuboring.\n\n` +
        `📱 Quyidagi tugmani bosing yoki raqamingizni yozing (masalan: +998901234567):`,
      {
        reply_markup: {
          keyboard: [
            [{ text: "📱 Telefon raqamni yuborish", request_contact: true }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      },
    );
  }

  // ─── Handle contact/phone sharing ─────────────────────────
  private async handleContactMessage(ctx: Context) {
    const message = ctx.message as any;

    let phone: string | undefined;

    if (message?.contact) {
      phone = message.contact.phone_number;
    } else if (message?.text) {
      // Accept manually typed phone number
      const cleaned = message.text.replace(/[\s\-\+\(\)]/g, '');
      if (/^\d{9,12}$/.test(cleaned)) {
        phone = cleaned;
      } else {
        return; // Not a phone number, ignore
      }
    } else {
      return;
    }
    // Normalize phone: remove leading +, spaces, dashes
    phone = phone.replace(/[\s\-\+]/g, "");

    const chatId = String(ctx.chat!.id);

    // Find parent by phone number
    const parent = await this.studentParentModel.findOne({
      where: {
        [Op.or]: [
          { phone_number: { [Op.like]: `%${phone.slice(-9)}` } },
          { additional_number: { [Op.like]: `%${phone.slice(-9)}` } },
        ],
      },
    });

    if (!parent) {
      return ctx.reply(
        `❌ *Kechirasiz, bu telefon raqam tizimda topilmadi.*\n\n` +
          `🔍 Iltimos, telefon raqamingiz *to'g'ri kiritilganligini* tekshiring.\n\n` +
          `📞 *Bog'lanish uchun:*\n` +
          `📱 Telegram: @impulseadm\n` +
          `☎️ Telefon: *+998955259966*`,
        {
          parse_mode: "Markdown",
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    // Link telegram chat to parent
    await parent.update({ telegram_chat_id: chatId });

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["user_id", "first_name", "last_name"],
    });

    await this.deleteOldBotMessage(chatId);
    const sent = await ctx.reply(
      `✅ Muvaffaqiyatli ulandi!\n\n` +
        `👤 Ota-ona: ${parent.full_name}\n` +
        `👨‍🎓 Talaba: ${student ? `${student.first_name} ${student.last_name}` : "Noma'lum"}\n\n` +
        `📋 /menu — Asosiy menyu`,
      {
        reply_markup: { remove_keyboard: true },
      },
    );
    this.lastBotMessage.set(chatId, sent.message_id);
    return sent;
  }

  // ─── /menu ─────────────────────────────────────────────────
  private async handleMenu(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    return this.sendAndTrack(ctx, `📋 *Asosiy menyu*\n\nQuyidagilardan birini tanlang:`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💰 To'lovlar", callback_data: "menu_payments" },
            { text: "📅 Davomat", callback_data: "menu_attendance" },
          ],
          [
            { text: "📊 Baholar", callback_data: "menu_grades" },
            { text: "📝 Imtihonlar", callback_data: "menu_exams" },
          ],
          [
            { text: "📈 O'quv jarayoni", callback_data: "menu_progress" },
            { text: "👤 Profil", callback_data: "menu_profile" },
          ],
        ],
      },
    });
  }

  // ─── /payments ─────────────────────────────────────────────
  private async handlePayments(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const payments = await this.studentPaymentModel.findAll({
      where: { student_id: parent.student_id },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const paymentStatus = await this.studentPaymentService.calculateStudentPaymentStatus(parent.student_id);

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });

    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    const statusEmoji = paymentStatus.paymentStatus === "overdue" ? "🔴" : paymentStatus.paymentStatus === "upcoming" ? "🟡" : "🟢";
    const statusText = paymentStatus.paymentStatus === "overdue" ? "Muddati o'tgan" : paymentStatus.paymentStatus === "upcoming" ? "Kutilmoqda" : "To'langan";

    let text = `💰 *To'lovlar — ${studentName}*\n\n`;
    text += `💳 Jami to'langan: *${paymentStatus.totalPaid?.toLocaleString() ?? 0} so'm*\n`;
    text += `${statusEmoji} Holat: *${statusText}*\n`;
    if (paymentStatus.pendingAmount > 0) {
      text += `⏳ Qarzdorlik: *${paymentStatus.pendingAmount?.toLocaleString()} so'm*\n`;
    }
    if (paymentStatus.nextPaymentDate) {
      text += `📅 Keyingi to'lov: *${new Date(paymentStatus.nextPaymentDate).toLocaleDateString("uz-UZ")}*`;
      if (paymentStatus.daysUntilNextPayment < 0) {
        text += ` _(${Math.abs(paymentStatus.daysUntilNextPayment)} kun kechikkan)_`;
      } else if (paymentStatus.daysUntilNextPayment > 0) {
        text += ` _(${paymentStatus.daysUntilNextPayment} kun qoldi)_`;
      }
      text += `\n`;
    }
    text += `\n`;

    if (payments.length === 0) {
      text += `📭 Hozircha to'lovlar yo'q.`;
    } else {
      text += `📋 Oxirgi to'lovlar:\n\n`;
      for (const p of payments) {
        const date = p.payment_date
          ? new Date(p.payment_date).toLocaleDateString("uz-UZ")
          : "—";
        const statusEmoji =
          p.status === "completed"
            ? "✅"
            : p.status === "pending"
              ? "⏳"
              : "❌";
        text += `${statusEmoji} ${date} — *${p.amount?.toLocaleString()} so'm*\n`;
        text += `   📌 ${p.payment_method} | ${p.status}\n`;
        if (p.next_payment_date) {
          text += `   📅 Keyingi to'lov: ${new Date(p.next_payment_date).toLocaleDateString("uz-UZ")}\n`;
        }
        text += `\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /attendance ───────────────────────────────────────────
  private async handleAttendance(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    // Get last 30 days attendance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const records = await this.attendanceModel.findAll({
      where: {
        student_id: parent.student_id,
        date: { [Op.gte]: thirtyDaysAgo },
      },
      order: [["date", "DESC"]],
    });

    // Fetch group names for attendance records
    const groupIds = [...new Set(records.map((r) => r.group_id))];
    const groups = await this.groupModel.findAll({
      where: { id: groupIds },
      attributes: ["id", "name"],
    });
    const groupMap = new Map(groups.map((g) => [g.id, g.name]));

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

    let text = `📅 *Davomat — ${studentName}*\n`;
    text += `_(Oxirgi 30 kun)_\n\n`;
    text += `📊 Umumiy statistika:\n`;
    text += `   ✅ Kelgan: *${present}* kun\n`;
    text += `   ❌ Kelmagan: *${absent}* kun\n`;
    text += `   ⏰ Kechikkan: *${late}* kun\n`;
    text += `   📈 Davomat: *${attendanceRate}%*\n\n`;

    if (records.length > 0) {
      text += `📋 Oxirgi darslar:\n\n`;
      for (const r of records.slice(0, 10)) {
        const date = new Date(r.date).toLocaleDateString("uz-UZ");
        const emoji =
          r.status === "present"
            ? "✅"
            : r.status === "absent"
              ? "❌"
              : "⏰";
        const groupName = groupMap.get(r.group_id) || "—";
        text += `${emoji} ${date} | ${groupName}\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /grades ───────────────────────────────────────────────
  private async handleGrades(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    const gradings = await this.gradingModel.findAll({
      where: { student_id: parent.student_id },
      include: [{ model: Group, as: "group", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
      limit: 15,
    });

    let text = `📊 *Baholar — ${studentName}*\n\n`;

    if (gradings.length === 0) {
      text += `📭 Hozircha baholar yo'q.`;
    } else {
      // Calculate average
      const avgGrade =
        gradings.reduce((sum, g) => sum + (g.grade || 0), 0) / gradings.length;
      const avgPercent =
        gradings.reduce((sum, g) => sum + (g.percent || 0), 0) /
        gradings.length;

      text += `📈 O'rtacha: *${avgGrade.toFixed(1)}/10* (${avgPercent.toFixed(0)}%)\n\n`;
      text += `📋 Oxirgi baholar:\n\n`;

      for (const g of gradings) {
        const date = new Date(g.createdAt).toLocaleDateString("uz-UZ");
        const groupName = (g as any).group?.name || "—";
        const gradeEmoji = g.grade >= 8 ? "🌟" : g.grade >= 5 ? "📗" : "📕";
        text += `${gradeEmoji} ${date} — *${g.grade}/10* (${g.percent}%)\n`;
        text += `   📚 ${groupName}`;
        if (g.lesson_name) text += ` | ${g.lesson_name}`;
        text += `\n`;
        if (g.note) text += `   💬 ${g.note}\n`;
        text += `\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /exams ────────────────────────────────────────────────
  private async handleExams(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    const examResults = await this.examResultModel.findAll({
      where: { student_id: parent.student_id },
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    // Fetch exam details separately
    const examIds = [...new Set(examResults.map((er) => er.exam_id))];
    const exams = await this.examModel.findAll({
      where: { id: examIds },
      attributes: ["id", "title", "scheduled_at", "status", "level"],
    });
    const examMap = new Map(exams.map((e) => [e.id, e]));

    let text = `📝 *Imtihon natijalari — ${studentName}*\n\n`;

    if (examResults.length === 0) {
      text += `📭 Hozircha imtihon natijalari yo'q.`;
    } else {
      for (const er of examResults) {
        const exam = examMap.get(er.exam_id);
        const resultEmoji = er.result === "passed" ? "✅" : "❌";
        const date = exam?.scheduled_at
          ? new Date(exam.scheduled_at).toLocaleDateString("uz-UZ")
          : "—";

        text += `${resultEmoji} *${exam?.title || "Imtihon"}*\n`;
        text += `   📅 ${date} | ${exam?.level || "—"}\n`;
        text += `   📊 Ball: *${er.score}/${er.max_score}* (${er.percentage}%)\n`;

        // Section scores if available
        if (er.section_scores) {
          const sections = er.section_scores as any;
          const sectionParts: string[] = [];
          if (sections.reading !== undefined)
            sectionParts.push(`Reading: ${sections.reading}`);
          if (sections.writing !== undefined)
            sectionParts.push(`Writing: ${sections.writing}`);
          if (sections.listening !== undefined)
            sectionParts.push(`Listening: ${sections.listening}`);
          if (sections.speaking !== undefined)
            sectionParts.push(`Speaking: ${sections.speaking}`);
          if (sections.grammar !== undefined)
            sectionParts.push(`Grammar: ${sections.grammar}`);
          if (sections.vocabulary !== undefined)
            sectionParts.push(`Vocabulary: ${sections.vocabulary}`);
          if (sectionParts.length > 0) {
            text += `   📋 ${sectionParts.join(" | ")}\n`;
          }
        }

        if (er.feedback) {
          text += `   💬 ${er.feedback}\n`;
        }
        text += `\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /progress ─────────────────────────────────────────────
  private async handleProgress(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    // Student profile (gamification)
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: parent.student_id },
    });

    // Groups the student belongs to
    const groupStudents = await this.groupStudentModel.findAll({
      where: { student_id: parent.student_id, status: "active" },
      include: [{ model: this.groupModel, as: "group", attributes: ["name"] }],
    });

    // Course progress
    let courseProgressList: any[] = [];
    try {
      courseProgressList = await this.coursesService.getAllCourseProgress(parent.student_id);
    } catch {
      // Student may not be in any English group
    }

    let text = `📈 *O'quv jarayoni — ${studentName}*\n\n`;

    // Profile stats
    if (profile) {
      text += `🏆 *Profil:*\n`;
      text += `   ⭐ Ball: ${profile.points}\n`;
      text += `   🪙 Tangalar: ${profile.coins}\n`;
      text += `   🔥 Streak: ${profile.streaks} kun\n`;
      text += `   📊 Daraja: ${profile.level}\n\n`;
    }

    // Active groups
    if (groupStudents.length > 0) {
      text += `📚 *Guruhlar:*\n`;
      for (const gs of groupStudents) {
        const groupName = (gs as any).group?.name || "—";
        text += `   📖 ${groupName}\n`;
      }
      text += `\n`;
    }

    // Course progress
    if (courseProgressList.length > 0) {
      text += `📋 *Kurs natijalari:*\n\n`;
      for (const cp of courseProgressList) {
        const progressEmoji = cp.percentage >= 100 ? "✅" : cp.percentage >= 50 ? "📗" : "📕";
        text += `${progressEmoji} *${cp.course_name}*\n`;
        text += `   📊 ${cp.completed}/${cp.total} dars — *${cp.percentage}%*\n\n`;
      }
    } else {
      text += `📭 Hozircha kurs natijalari yo'q.\n`;
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /profile ──────────────────────────────────────────────
  private async handleProfile(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    const student = await this.userModel.findByPk(parent.student_id, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : "Noma'lum";

    const wallet = await this.studentWalletModel.findOne({
      where: { student_id: parent.student_id },
    });

    const profile = await this.studentProfileModel.findOne({
      where: { user_id: parent.student_id },
    });

    let text = `👤 *Profil*\n\n`;
    text += `👤 Ota-ona: *${parent.full_name}*\n`;
    text += `📱 Telefon: ${parent.phone_number}\n`;
    text += `👨‍🎓 Talaba: *${studentName}*\n`;
    if (wallet) {
      text += `💳 Balans: *${wallet.amount?.toLocaleString() ?? 0} so'm*\n`;
    }
    if (profile) {
      text += `⭐ Ball: ${profile.points} | 🪙 Tangalar: ${profile.coins}\n`;
      text += `🔥 Streak: ${profile.streaks} kun | 📊 Daraja: ${profile.level}\n`;
    }

    return this.sendAndTrack(ctx, text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔓 Profilni uzish (Unlink)",
              callback_data: "confirm_unlink",
            },
          ],
          [{ text: "◀️ Menyu", callback_data: "menu_back" }],
        ],
      },
    });
  }

  // ─── /unlink ───────────────────────────────────────────────
  private async handleUnlink(ctx: Context) {
    const parent = await this.getLinkedParent(ctx);
    if (!parent) return;

    return this.sendAndTrack(
      ctx,
      `⚠️ Haqiqatan ham profilni uzmoqchimisiz?\n\nBu amalni bajargandan so'ng botdan ma'lumotlarni ko'ra olmaysiz.`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Ha, uzish", callback_data: "do_unlink" },
              { text: "❌ Yo'q", callback_data: "menu_back" },
            ],
          ],
        },
      },
    );
  }

  // ─── /help ─────────────────────────────────────────────────
  private async handleHelp(ctx: Context) {
    return this.sendAndTrack(
      ctx,
      `❓ *Yordam*\n\n` +
        `Bu bot orqali farzandingizning o'quv jarayonini kuzatishingiz mumkin.\n\n` +
        `📋 *Buyruqlar:*\n` +
        `/menu — Asosiy menyu\n` +
        `/payments — To'lovlar va balans\n` +
        `/attendance — Davomat statistikasi\n` +
        `/grades — Baholar\n` +
        `/exams — Imtihon natijalari\n` +
        `/progress — O'quv jarayoni va profil\n` +
        `/profile — Profil ma'lumotlari\n` +
        `/unlink — Profilni uzish\n` +
        `/help — Ushbu yordam\n\n` +
        `Muammo bo'lsa, o'quv markazi bilan bog'laning.`,
      { parse_mode: "Markdown" },
    );
  }

  // ─── Callback queries from inline keyboard ─────────────────
  private async handleCallbackQuery(ctx: Context) {
    const callbackQuery = ctx.callbackQuery as any;
    const data = callbackQuery?.data;
    if (!data) return;

    await ctx.answerCbQuery();

    switch (data) {
      case "menu_payments":
        return this.handlePayments(ctx);
      case "menu_attendance":
        return this.handleAttendance(ctx);
      case "menu_grades":
        return this.handleGrades(ctx);
      case "menu_exams":
        return this.handleExams(ctx);
      case "menu_progress":
        return this.handleProgress(ctx);
      case "menu_profile":
        return this.handleProfile(ctx);
      case "menu_back":
        return this.handleMenu(ctx);
      case "confirm_unlink":
        return this.handleUnlink(ctx);
      case "do_unlink": {
        const parent = await this.getLinkedParent(ctx);
        if (!parent) return;
        await parent.update({ telegram_chat_id: null });
        this.lastBotMessage.delete(String(ctx.chat!.id));
        return ctx.reply(
          `✅ Profilingiz muvaffaqiyatli uzildi.\n\nQayta ulash uchun /start buyrug'ini yuboring.`,
        );
      }
      default:
        return;
    }
  }

  // ─── Helper: get linked parent ─────────────────────────────
  private async getLinkedParent(ctx: Context): Promise<StudentParent | null> {
    const chatId = String(ctx.chat!.id);

    const parent = await this.studentParentModel.findOne({
      where: { telegram_chat_id: chatId },
    });

    if (!parent) {
      await ctx.reply(
        `⚠️ Siz hali ro'yxatdan o'tmagansiz.\n\nBoshlash uchun /start buyrug'ini yuboring.`,
      );
      return null;
    }

    return parent;
  }

  // ─── Public: send notification to parent ───────────────────
  async sendNotificationToParent(
    studentId: string,
    message: string,
  ): Promise<void> {
    const parents = await this.studentParentModel.findAll({
      where: {
        student_id: studentId,
        telegram_chat_id: { [Op.ne]: null },
      },
    });

    for (const parent of parents) {
      try {
        await this.bot.telegram.sendMessage(parent.telegram_chat_id!, message, {
          parse_mode: "Markdown",
        });
      } catch (error) {
        this.logger.error(
          `Failed to send Telegram message to parent ${parent.id}: ${error}`,
        );
      }
    }
  }

  // ─── Auto-notifications ────────────────────────────────────

  /** Notify parent when attendance is recorded */
  async notifyAttendance(
    studentId: string,
    status: string,
    date: string,
    groupName?: string,
  ): Promise<void> {
    const emoji =
      status === "present" ? "✅" : status === "absent" ? "❌" : "⏰";
    const statusText =
      status === "present"
        ? "Keldi"
        : status === "absent"
          ? "Kelmadi"
          : "Kechikdi";
    const formattedDate = new Date(date).toLocaleDateString("uz-UZ");
    const group = groupName ? ` | 📚 ${groupName}` : "";

    const message =
      `📅 *Davomat yangilandi*\n\n` +
      `${emoji} Holat: *${statusText}*\n` +
      `📆 Sana: ${formattedDate}${group}`;

    await this.sendNotificationToParent(studentId, message);
  }

  /** Notify parent when a grade is given */
  async notifyGrading(
    studentId: string,
    grade: number,
    percent: number,
    groupName?: string,
    lessonName?: string,
    note?: string,
  ): Promise<void> {
    const gradeEmoji = grade >= 8 ? "🌟" : grade >= 5 ? "📗" : "📕";
    let message =
      `📊 *Yangi baho qo'yildi*\n\n` +
      `${gradeEmoji} Baho: *${grade}/10* (${percent}%)`;
    if (groupName) message += `\n📚 Guruh: ${groupName}`;
    if (lessonName) message += `\n📖 Dars: ${lessonName}`;
    if (note) message += `\n💬 Izoh: ${note}`;

    await this.sendNotificationToParent(studentId, message);
  }

  /** Notify parent when a payment is made */
  async notifyPayment(
    studentId: string,
    amount: number,
    status: string,
    paymentMethod: string,
    nextPaymentDate?: string,
  ): Promise<void> {
    const statusEmoji =
      status === "completed" ? "✅" : status === "pending" ? "⏳" : "❌";
    let message =
      `💰 *To'lov ma'lumoti*\n\n` +
      `${statusEmoji} Holat: *${status}*\n` +
      `💵 Summa: *${amount?.toLocaleString()} so'm*\n` +
      `💳 Usul: ${paymentMethod}`;
    if (nextPaymentDate) {
      message += `\n📅 Keyingi to'lov: ${new Date(nextPaymentDate).toLocaleDateString("uz-UZ")}`;
    }

    await this.sendNotificationToParent(studentId, message);
  }
}
