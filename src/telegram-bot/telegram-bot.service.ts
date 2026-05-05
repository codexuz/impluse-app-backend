import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  forwardRef,
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
import { StudentPaymentService } from "../student-payment/student-payment.service.js";
import { CoursesService } from "../courses/courses.service.js";
import { TelegramChatService } from "../telegram-chat/telegram-chat.service.js";

// ─── i18n translations ────────────────────────────────────────────────────────
export type Lang = 'uz' | 'en' | 'ru';

const T: Record<Lang, Record<string, string>> = {
  uz: {
    select_language: '🌐 Tilni tanlang:',
    btn_uz: '🇺🇿 O\'zbek', btn_en: '🇬🇧 English', btn_ru: '🇷🇺 Русский',
    lang_set: '✅ Til o\'rnatildi: O\'zbek 🇺🇿',
    unknown: 'Noma\'lum',
    not_registered: '⚠️ Siz hali ro\'yxatdan o\'tmagansiz.\n\nBoshlash uchun /start buyrug\'ini yuboring.',
    welcome: '👋 Assalomu alaykum! Impulse o\'quv markazi botiga xush kelibsiz.\n\nFarzandingiz haqidagi ma\'lumotlarni ko\'rish uchun telefon raqamingizni yuboring.\n\n📱 Quyidagi tugmani bosing yoki raqamingizni yozing (masalan: +998901234567):',
    share_phone_btn: '📱 Telefon raqamni yuborish',
    already_registered: '✅ Siz allaqachon ro\'yxatdan o\'tgansiz!',
    child_singular: '👨‍🎓 Farzand:', children_plural: '👨‍👩‍👧‍👦 Farzandlar:',
    menu_hint: '📋 Menyu uchun /menu bosing.',
    link_more_btn: '🔗 Yangi farzand ulash', menu_btn: '📋 Menyu',
    phone_not_found: '❌ *Kechirasiz, bu telefon raqam tizimda topilmadi.*\n\n🔍 Iltimos, telefon raqamingiz *to\'g\'ri kiritilganligini* tekshiring.\n\n📞 *Bog\'lanish uchun:*\n📱 Telegram: @impulseadm\n☎️ Telefon: *+998955259966*',
    link_success: '✅ Muvaffaqiyatli ulandi!', relink_success: '✅ Yangi farzandlar muvaffaqiyatli ulandi!',
    no_new_children: 'ℹ️ Yangi farzand topilmadi.\n\nBarcha farzandlar allaqachon ulangan:',
    parent_label: '👤 Ota-ona:', new_children_label: '🆕 Yangi ulangan farzandlar:',
    prev_children_label: '✅ Avval ulangan farzandlar:', student_label: '👨‍🎓 Talaba:',
    menu_link: '📋 /menu — Asosiy menyu',
    main_menu: '📋 *Asosiy menyu*', menu_select: 'Quyidagilardan birini tanlang:',
    payments_btn: '💰 To\'lovlar', attendance_btn: '📅 Davomat',
    grades_btn: '📊 Baholar', exams_btn: '📝 Imtihonlar',
    progress_btn: '📈 O\'quv jarayoni', profile_btn: '👤 Profil',
    switch_child_btn: '👨‍👩‍👧‍👦 Farzandni o\'zgartirish', children_count: 'nafar farzand',
    lang_btn: '🌐 Til',
    payments_title: '💰 *To\'lovlar', total_paid: '💳 Jami to\'langan:',
    status_label: 'Holat:', pending_amount: '⏳ Qarzdorlik:',
    next_payment: '📅 Keyingi to\'lov:', days_overdue: 'kun kechikkan', days_left: 'kun qoldi',
    no_payments: '📭 Hozircha to\'lovlar yo\'q.', recent_payments: '📋 Oxirgi to\'lovlar:',
    status_overdue: 'Qarzdor', status_pending: 'Kutilmoqda', status_paid: 'To\'langan',
    pay_completed: 'Qabul qilindi', pay_pending: 'Kutilmoqda', pay_cancelled: 'Bekor qilindi',
    attendance_title: '📅 *Davomat', last_30: '_(Oxirgi 30 kun)_',
    stats: '📊 Umumiy statistika:',
    present_days: '✅ Kelgan:', absent_days: '❌ Kelmagan:', late_days: '⏰ Kechikkan:',
    rate: '📈 Davomat:', recent_lessons: '📋 Oxirgi darslar:',
    att_present: 'Keldi', att_absent: 'Kelmadi', att_late: 'Kechikdi',
    grades_title: '📊 *Baholar', no_grades: '📭 Hozircha baholar yo\'q.',
    avg_grade: '📈 O\'rtacha:', recent_grades: '📋 Oxirgi baholar:',
    exams_title: '📝 *Imtihon natijalari', no_exams: '📭 Hozircha imtihon natijalari yo\'q.',
    score_label: '📊 Ball:',
    progress_title: '📈 *O\'quv jarayoni', profile_section: '🏆 *Profil:*',
    points_label: '⭐ Ball:', coins_label: '🪙 Tangalar:',
    streak_label: '🔥 Streak:', streak_unit: 'kun',
    rank_label: '🏅 Reyting:', rank_suffix: '-o\'rin',
    groups_section: '📚 *Guruhlar:*', courses_section: '📋 *Kurs natijalari:*',
    no_courses: '📭 Hozircha kurs natijalari yo\'q.', lesson_unit: 'dars',
    profile_title: '👤 *Profil*', parent_name: '👤 Ota-ona:', phone_label: '📱 Telefon:',
    last_payment: '💳 Oxirgi to\'lov:', payment_status: 'To\'lov holati:', currency: 'so\'m',
    unlink_btn: '🔓 Profilni uzish (Unlink)', back_btn: '◀️ Menyu',
    unlink_warning_single: '⚠️ Haqiqatan ham profilni uzmoqchimisiz?\n\nBu amalni bajargandan so\'ng botdan ma\'lumotlarni ko\'ra olmaysiz.',
    unlink_warning_multi: '⚠️ Haqiqatan ham profilni uzmoqchimisiz?\n\nBarcha {count} nafar farzandingiz uchun aloqa uziladi va botdan ma\'lumotlarni ko\'ra olmaysiz.',
    yes_unlink: '✅ Ha, uzish', no_btn: '❌ Yo\'q',
    unlinked: '✅ Profilingiz muvaffaqiyatli uzildi.\n\nQayta ulash uchun /start buyrug\'ini yuboring.',
    help_title: '❓ *Yordam*',
    help_body: 'Bu bot orqali farzandingizning o\'quv jarayonini kuzatishingiz mumkin.',
    help_commands: '📋 *Buyruqlar:*',
    help_menu: '/menu — Asosiy menyu', help_payments: '/payments — To\'lovlar va balans',
    help_attendance: '/attendance — Davomat statistikasi', help_grades: '/grades — Baholar',
    help_exams: '/exams — Imtihon natijalari',
    help_progress: '/progress — O\'quv jarayoni va profil',
    help_profile: '/profile — Profil ma\'lumotlari', help_unlink: '/unlink — Profilni uzish',
    help_helpCmd: '/help — Ushbu yordam',
    help_contact: 'Muammo bo\'lsa, o\'quv markazi bilan bog\'laning.',
    child_selector: '👨‍👩‍👧‍👦 *Qaysi farzandingizni ko\'rmoqchisiz?*',
    link_more_prompt: '🔗 *Yangi farzand ulash*\n\nTelefon raqamingizni yuboring — tizimda siz bilan bog\'liq barcha yangi farzandlar avtomatik ulanadi.',
    notif_attendance_title: '📅 *Davomat bo\'yicha ma\'lumot*',
    notif_child: '👨‍🎓 Farzand:',
    notif_status: 'Holat:',
    notif_date: '📆 Sana:',
    notif_grade_title: '📊 *Baholash bo\'yicha ma\'lumot*',
    notif_grade: 'Baho:',
    notif_group: '📚 Guruh:',
    notif_lesson: '📖 Dars:',
    notif_teacher_note: '💬 O\'qituvchi izohi:',
    notif_payment_title: '💰 *To\'lov bo\'yicha ma\'lumot*',
    notif_amount: '💵 Summa:',
    notif_method: '💳 To\'lov usuli:',
    notif_next_date: '📅 Keyingi to\'lov sanasi:',
  },
  en: {
    select_language: '🌐 Select language:',
    btn_uz: '🇺🇿 O\'zbek', btn_en: '🇬🇧 English', btn_ru: '🇷🇺 Русский',
    lang_set: '✅ Language set: English 🇬🇧',
    unknown: 'Unknown',
    not_registered: '⚠️ You are not registered yet.\n\nSend /start to begin.',
    welcome: '👋 Welcome to Impulse Learning Center bot!\n\nTo view your child\'s information, please share your phone number.\n\n📱 Press the button below or type your number (e.g. +998901234567):',
    share_phone_btn: '📱 Share phone number',
    already_registered: '✅ You are already registered!',
    child_singular: '👨‍🎓 Child:', children_plural: '👨‍👩‍👧‍👦 Children:',
    menu_hint: '📋 Press /menu for main menu.',
    link_more_btn: '🔗 Link another child', menu_btn: '📋 Menu',
    phone_not_found: '❌ *Sorry, this phone number was not found in the system.*\n\n🔍 Please check that your phone number is entered *correctly*.\n\n📞 *Contact us:*\n📱 Telegram: @impulseadm\n☎️ Phone: *+998955259966*',
    link_success: '✅ Successfully linked!', relink_success: '✅ New children successfully linked!',
    no_new_children: 'ℹ️ No new children found.\n\nAll children are already linked:',
    parent_label: '👤 Parent:', new_children_label: '🆕 Newly linked children:',
    prev_children_label: '✅ Previously linked children:', student_label: '👨‍🎓 Student:',
    menu_link: '📋 /menu — Main menu',
    main_menu: '📋 *Main Menu*', menu_select: 'Select one of the following:',
    payments_btn: '💰 Payments', attendance_btn: '📅 Attendance',
    grades_btn: '📊 Grades', exams_btn: '📝 Exams',
    progress_btn: '📈 Progress', profile_btn: '👤 Profile',
    switch_child_btn: '👨‍👩‍👧‍👦 Switch child', children_count: 'children',
    lang_btn: '🌐 Language',
    payments_title: '💰 *Payments', total_paid: '💳 Total paid:',
    status_label: 'Status:', pending_amount: '⏳ Debt:',
    next_payment: '📅 Next payment:', days_overdue: 'days overdue', days_left: 'days left',
    no_payments: '📭 No payments yet.', recent_payments: '📋 Recent payments:',
    status_overdue: 'Overdue', status_pending: 'Pending', status_paid: 'Paid',
    pay_completed: 'Accepted', pay_pending: 'Pending', pay_cancelled: 'Cancelled',
    attendance_title: '📅 *Attendance', last_30: '_(Last 30 days)_',
    stats: '📊 Overall statistics:',
    present_days: '✅ Present:', absent_days: '❌ Absent:', late_days: '⏰ Late:',
    rate: '📈 Rate:', recent_lessons: '📋 Recent lessons:',
    att_present: 'Present', att_absent: 'Absent', att_late: 'Late',
    grades_title: '📊 *Grades', no_grades: '📭 No grades yet.',
    avg_grade: '📈 Average:', recent_grades: '📋 Recent grades:',
    exams_title: '📝 *Exam Results', no_exams: '📭 No exam results yet.',
    score_label: '📊 Score:',
    progress_title: '📈 *Progress', profile_section: '🏆 *Profile:*',
    points_label: '⭐ Points:', coins_label: '🪙 Coins:',
    streak_label: '🔥 Streak:', streak_unit: 'days',
    rank_label: '🏅 Rank:', rank_suffix: 'th place',
    groups_section: '📚 *Groups:*', courses_section: '📋 *Course results:*',
    no_courses: '📭 No course results yet.', lesson_unit: 'lessons',
    profile_title: '👤 *Profile*', parent_name: '👤 Parent:', phone_label: '📱 Phone:',
    last_payment: '💳 Last payment:', payment_status: 'Payment status:', currency: 'UZS',
    unlink_btn: '🔓 Unlink profile', back_btn: '◀️ Menu',
    unlink_warning_single: '⚠️ Are you sure you want to unlink your profile?\n\nAfter this action you will not be able to view information from the bot.',
    unlink_warning_multi: '⚠️ Are you sure you want to unlink your profile?\n\nAll {count} children\'s connections will be removed and you won\'t be able to view information from the bot.',
    yes_unlink: '✅ Yes, unlink', no_btn: '❌ No',
    unlinked: '✅ Your profile has been successfully unlinked.\n\nSend /start to link again.',
    help_title: '❓ *Help*',
    help_body: 'With this bot you can track your child\'s learning progress.',
    help_commands: '📋 *Commands:*',
    help_menu: '/menu — Main menu', help_payments: '/payments — Payments & balance',
    help_attendance: '/attendance — Attendance statistics', help_grades: '/grades — Grades',
    help_exams: '/exams — Exam results', help_progress: '/progress — Learning progress & profile',
    help_profile: '/profile — Profile information', help_unlink: '/unlink — Unlink profile',
    help_helpCmd: '/help — This help',
    help_contact: 'If you have a problem, contact the learning center.',
    child_selector: '👨‍👩‍👧‍👦 *Which child do you want to view?*',
    link_more_prompt: '🔗 *Link another child*\n\nSend your phone number — all children linked to you in the system will be automatically connected.',
    notif_attendance_title: '📅 *Attendance update*',
    notif_child: '👨‍🎓 Child:',
    notif_status: 'Status:',
    notif_date: '📆 Date:',
    notif_grade_title: '📊 *Grade update*',
    notif_grade: 'Grade:',
    notif_group: '📚 Group:',
    notif_lesson: '📖 Lesson:',
    notif_teacher_note: '💬 Teacher note:',
    notif_payment_title: '💰 *Payment update*',
    notif_amount: '💵 Amount:',
    notif_method: '💳 Payment method:',
    notif_next_date: '📅 Next payment date:',
  },
  ru: {
    select_language: '🌐 Выберите язык:',
    btn_uz: '🇺🇿 O\'zbek', btn_en: '🇬🇧 English', btn_ru: '🇷🇺 Русский',
    lang_set: '✅ Язык установлен: Русский 🇷🇺',
    unknown: 'Неизвестно',
    not_registered: '⚠️ Вы ещё не зарегистрированы.\n\nОтправьте /start для начала.',
    welcome: '👋 Добро пожаловать в бот учебного центра Impulse!\n\nЧтобы просматривать информацию о вашем ребёнке, поделитесь номером телефона.\n\n📱 Нажмите кнопку ниже или введите номер (например: +998901234567):',
    share_phone_btn: '📱 Поделиться номером телефона',
    already_registered: '✅ Вы уже зарегистрированы!',
    child_singular: '👨‍🎓 Ребёнок:', children_plural: '👨‍👩‍👧‍👦 Дети:',
    menu_hint: '📋 Нажмите /menu для главного меню.',
    link_more_btn: '🔗 Привязать ещё ребёнка', menu_btn: '📋 Меню',
    phone_not_found: '❌ *Извините, этот номер телефона не найден в системе.*\n\n🔍 Пожалуйста, проверьте правильность ввода номера.\n\n📞 *Связаться с нами:*\n📱 Telegram: @impulseadm\n☎️ Телефон: *+998955259966*',
    link_success: '✅ Успешно привязано!', relink_success: '✅ Новые дети успешно привязаны!',
    no_new_children: 'ℹ️ Новые дети не найдены.\n\nВсе дети уже привязаны:',
    parent_label: '👤 Родитель:', new_children_label: '🆕 Новые привязанные дети:',
    prev_children_label: '✅ Ранее привязанные дети:', student_label: '👨‍🎓 Студент:',
    menu_link: '📋 /menu — Главное меню',
    main_menu: '📋 *Главное меню*', menu_select: 'Выберите один из следующих вариантов:',
    payments_btn: '💰 Платежи', attendance_btn: '📅 Посещаемость',
    grades_btn: '📊 Оценки', exams_btn: '📝 Экзамены',
    progress_btn: '📈 Учёба', profile_btn: '👤 Профиль',
    switch_child_btn: '👨‍👩‍👧‍👦 Сменить ребёнка', children_count: 'детей',
    lang_btn: '🌐 Язык',
    payments_title: '💰 *Платежи', total_paid: '💳 Итого оплачено:',
    status_label: 'Статус:', pending_amount: '⏳ Задолженность:',
    next_payment: '📅 Следующий платёж:', days_overdue: 'дней просрочено', days_left: 'дней осталось',
    no_payments: '📭 Платежей пока нет.', recent_payments: '📋 Последние платежи:',
    status_overdue: 'Задолженность', status_pending: 'Ожидается', status_paid: 'Оплачено',
    pay_completed: 'Принято', pay_pending: 'Ожидается', pay_cancelled: 'Отменено',
    attendance_title: '📅 *Посещаемость', last_30: '_(Последние 30 дней)_',
    stats: '📊 Общая статистика:',
    present_days: '✅ Присутствовал:', absent_days: '❌ Отсутствовал:', late_days: '⏰ Опоздал:',
    rate: '📈 Посещаемость:', recent_lessons: '📋 Последние занятия:',
    att_present: 'Присутствовал', att_absent: 'Отсутствовал', att_late: 'Опоздал',
    grades_title: '📊 *Оценки', no_grades: '📭 Оценок пока нет.',
    avg_grade: '📈 Среднее:', recent_grades: '📋 Последние оценки:',
    exams_title: '📝 *Результаты экзаменов', no_exams: '📭 Результатов экзаменов пока нет.',
    score_label: '📊 Баллы:',
    progress_title: '📈 *Учёба', profile_section: '🏆 *Профиль:*',
    points_label: '⭐ Баллы:', coins_label: '🪙 Монеты:',
    streak_label: '🔥 Серия:', streak_unit: 'дней',
    rank_label: '🏅 Рейтинг:', rank_suffix: '-е место',
    groups_section: '📚 *Группы:*', courses_section: '📋 *Результаты курсов:*',
    no_courses: '📭 Результатов курсов пока нет.', lesson_unit: 'уроков',
    profile_title: '👤 *Профиль*', parent_name: '👤 Родитель:', phone_label: '📱 Телефон:',
    last_payment: '💳 Последний платёж:', payment_status: 'Статус платежа:', currency: 'сум',
    unlink_btn: '🔓 Отвязать профиль', back_btn: '◀️ Меню',
    unlink_warning_single: '⚠️ Вы действительно хотите отвязать профиль?\n\nПосле этого действия вы не сможете просматривать информацию через бота.',
    unlink_warning_multi: '⚠️ Вы действительно хотите отвязать профиль?\n\nСвязь для всех {count} детей будет разорвана, и вы не сможете просматривать информацию через бота.',
    yes_unlink: '✅ Да, отвязать', no_btn: '❌ Нет',
    unlinked: '✅ Ваш профиль успешно отвязан.\n\nОтправьте /start для повторной привязки.',
    help_title: '❓ *Помощь*',
    help_body: 'С помощью этого бота вы можете отслеживать учёбу вашего ребёнка.',
    help_commands: '📋 *Команды:*',
    help_menu: '/menu — Главное меню', help_payments: '/payments — Платежи и баланс',
    help_attendance: '/attendance — Статистика посещаемости', help_grades: '/grades — Оценки',
    help_exams: '/exams — Результаты экзаменов',
    help_progress: '/progress — Учёба и профиль',
    help_profile: '/profile — Информация профиля', help_unlink: '/unlink — Отвязать профиль',
    help_helpCmd: '/help — Эта помощь',
    help_contact: 'При возникновении проблем свяжитесь с учебным центром.',
    child_selector: '👨‍👩‍👧‍👦 *Кого из детей вы хотите посмотреть?*',
    link_more_prompt: '🔗 *Привязать ещё ребёнка*\n\nОтправьте ваш номер телефона — все дети, связанные с вами в системе, будут автоматически привязаны.',
    notif_attendance_title: '📅 *Обновление посещаемости*',
    notif_child: '👨‍🎓 Ребёнок:',
    notif_status: 'Статус:',
    notif_date: '📆 Дата:',
    notif_grade_title: '📊 *Обновление оценки*',
    notif_grade: 'Оценка:',
    notif_group: '📚 Группа:',
    notif_lesson: '📖 Урок:',
    notif_teacher_note: '💬 Комментарий учителя:',
    notif_payment_title: '💰 *Обновление платежа*',
    notif_amount: '💵 Сумма:',
    notif_method: '💳 Способ оплаты:',
    notif_next_date: '📅 Дата следующего платежа:',
  },
};

@Injectable()
export class TelegramBotService implements OnModuleInit, OnModuleDestroy {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramBotService.name);
  /** Track last bot message per chat so we can delete it when a new command arrives */
  private lastBotMessage = new Map<string, number>();
  /** Track selected child (student_id) per chat for parents with multiple children */
  private selectedChild = new Map<string, string>();
  /** User language preference – defaults to 'uz' */
  private userLanguage = new Map<string, Lang>();

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
    @Inject(forwardRef(() => StudentPaymentService))
    private readonly studentPaymentService: any,
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => TelegramChatService))
    private readonly telegramChatService: TelegramChatService,
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

  // ─── i18n helpers ──────────────────────────────────────────
  private getLang(ctx: Context): Lang {
    return this.userLanguage.get(String(ctx.chat!.id)) ?? 'uz';
  }

  private t(ctx: Context | string, key: string): string {
    const lang = typeof ctx === 'string'
      ? (this.userLanguage.get(ctx) ?? 'uz')
      : this.getLang(ctx);
    return T[lang][key] ?? T['uz'][key] ?? key;
  }

  private langButtons() {
    return [
      [
        { text: T['uz']['btn_uz'], callback_data: 'lang_uz' },
        { text: T['uz']['btn_en'], callback_data: 'lang_en' },
        { text: T['uz']['btn_ru'], callback_data: 'lang_ru' },
      ],
    ];
  }

  /** Show language selection inline keyboard */
  private async sendLanguageSelector(ctx: Context, afterSelection?: () => Promise<any>) {
    const chatId = String(ctx.chat!.id);
    return this.sendAndTrack(ctx, T['uz']['select_language'], {
      reply_markup: { inline_keyboard: this.langButtons() },
    });
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
    this.bot.command("payments", (ctx) => { this.selectedChild.delete(String(ctx.chat!.id)); return this.handlePayments(ctx); });
    this.bot.command("attendance", (ctx) => { this.selectedChild.delete(String(ctx.chat!.id)); return this.handleAttendance(ctx); });
    this.bot.command("grades", (ctx) => { this.selectedChild.delete(String(ctx.chat!.id)); return this.handleGrades(ctx); });
    this.bot.command("exams", (ctx) => { this.selectedChild.delete(String(ctx.chat!.id)); return this.handleExams(ctx); });
    this.bot.command("progress", (ctx) => { this.selectedChild.delete(String(ctx.chat!.id)); return this.handleProgress(ctx); });
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

    // If language not yet selected, show language selector first
    if (!this.userLanguage.has(chatId)) {
      return this.sendLanguageSelector(ctx);
    }

    // Check if already linked
    const existingParents = await this.studentParentModel.findAll({
      where: { telegram_chat_id: chatId },
    });

    if (existingParents.length > 0) {
      const students = await this.userModel.findAll({
        where: { user_id: existingParents.map((p) => p.student_id) },
        attributes: ["user_id", "first_name", "last_name"],
      });
      const studentMap = new Map(students.map((s) => [s.user_id, s]));
      const childList = existingParents
        .map((p, i) => {
          const s = studentMap.get(p.student_id);
          return `${i + 1}. ${s ? `${s.first_name} ${s.last_name}` : this.t(ctx, 'unknown')}`;
        })
        .join("\n");
      const childLabel = existingParents.length === 1
        ? `${this.t(ctx, 'child_singular')}\n${childList}`
        : `${this.t(ctx, 'children_plural')}\n${childList}`;
      return this.sendAndTrack(
        ctx,
        `${this.t(ctx, 'already_registered')}\n\n👤 ${existingParents[0].full_name}\n\n${childLabel}\n\n${this.t(ctx, 'menu_hint')}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: this.t(ctx, 'link_more_btn'), callback_data: "link_more_children" }],
              [{ text: this.t(ctx, 'menu_btn'), callback_data: "menu_back" }],
            ],
          },
        },
      );
    }

    return this.sendAndTrack(
      ctx,
      this.t(ctx, 'welcome'),
      {
        reply_markup: {
          keyboard: [
            [{ text: this.t(ctx, 'share_phone_btn'), request_contact: true }],
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
        // Not a phone number — save as an incoming chat message if parent is registered
        const chatId = String(ctx.chat!.id);
        const linkedParent = await this.studentParentModel.findOne({
          where: { telegram_chat_id: chatId },
        });
        if (linkedParent) {
          await this.telegramChatService.saveIncomingMessage(chatId, message.text);
        }
        return; // Not a phone number, ignore for registration
      }
    } else {
      return;
    }
    // Normalize phone: remove leading +, spaces, dashes
    phone = phone.replace(/[\s\-\+]/g, "");

    const chatId = String(ctx.chat!.id);

    // Find ALL parent records by phone number (one parent may have multiple children)
    const parentRecords = await this.studentParentModel.findAll({
      where: {
        [Op.or]: [
          { phone_number: { [Op.like]: `%${phone.slice(-9)}` } },
          { additional_number: { [Op.like]: `%${phone.slice(-9)}` } },
        ],
      },
    });

    if (!parentRecords.length) {
      return ctx.reply(
        this.t(ctx, 'phone_not_found'),
        {
          parse_mode: "Markdown",
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    // Identify which records are newly linked vs already linked
    const alreadyLinkedIds = new Set(
      parentRecords.filter((p) => p.telegram_chat_id === chatId).map((p) => p.student_id),
    );

    // Link telegram chat to ALL parent records (one per child)
    await Promise.all(parentRecords.map((p) => p.update({ telegram_chat_id: chatId })));

    const students = await this.userModel.findAll({
      where: { user_id: parentRecords.map((p) => p.student_id) },
      attributes: ["user_id", "first_name", "last_name"],
    });
    const studentMap = new Map(students.map((s) => [s.user_id, s]));

    const newlyLinked = parentRecords.filter((p) => !alreadyLinkedIds.has(p.student_id));
    const isRelink = alreadyLinkedIds.size > 0;

    let successText = isRelink
      ? `${this.t(ctx, 'relink_success')}\n\n`
      : `${this.t(ctx, 'link_success')}\n\n`;
    successText += `${this.t(ctx, 'parent_label')} ${parentRecords[0].full_name}\n`;

    if (isRelink && newlyLinked.length === 0) {
      successText = `${this.t(ctx, 'no_new_children')}\n`;
      parentRecords.forEach((p, i) => {
        const s = studentMap.get(p.student_id);
        successText += `${i + 1}. ${s ? `${s.first_name} ${s.last_name}` : this.t(ctx, 'unknown')}\n`;
      });
    } else if (newlyLinked.length > 0) {
      successText += `\n${this.t(ctx, 'new_children_label')}\n`;
      newlyLinked.forEach((p, i) => {
        const s = studentMap.get(p.student_id);
        successText += `${i + 1}. ${s ? `${s.first_name} ${s.last_name}` : this.t(ctx, 'unknown')}\n`;
      });
      if (isRelink) {
        const already = parentRecords.filter((p) => alreadyLinkedIds.has(p.student_id));
        successText += `\n${this.t(ctx, 'prev_children_label')}\n`;
        already.forEach((p, i) => {
          const s = studentMap.get(p.student_id);
          successText += `${i + 1}. ${s ? `${s.first_name} ${s.last_name}` : this.t(ctx, 'unknown')}\n`;
        });
      }
    } else {
      // Fresh link with one child
      const student = studentMap.get(parentRecords[0].student_id);
      successText += `${this.t(ctx, 'student_label')} ${student ? `${student.first_name} ${student.last_name}` : this.t(ctx, 'unknown')}\n`;
    }
    successText += `\n${this.t(ctx, 'menu_link')}`;

    await this.deleteOldBotMessage(chatId);
    const sent = await ctx.reply(successText, {
      reply_markup: { remove_keyboard: true },
    });
    this.lastBotMessage.set(chatId, sent.message_id);
    return sent;
  }

  // ─── /menu ─────────────────────────────────────────────────
  private async handleMenu(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;

    const chatId = String(ctx.chat!.id);
    let headerText = `${this.t(ctx, 'main_menu')}\n\n`;

    if (parents.length > 1) {
      const selectedId = this.selectedChild.get(chatId);
      if (selectedId) {
        const student = await this.userModel.findByPk(selectedId, {
          attributes: ["first_name", "last_name"],
        });
        if (student) {
          headerText += `👨‍🎓 *${student.first_name} ${student.last_name}*\n\n`;
        }
      } else {
        headerText += `👨‍👩‍👧‍👦 ${parents.length} ${this.t(ctx, 'children_count')}\n\n`;
      }
    }

    const inlineKeyboard: any[] = [
      [
        { text: this.t(ctx, 'payments_btn'), callback_data: "menu_payments" },
        { text: this.t(ctx, 'attendance_btn'), callback_data: "menu_attendance" },
      ],
      [
        { text: this.t(ctx, 'grades_btn'), callback_data: "menu_grades" },
        { text: this.t(ctx, 'exams_btn'), callback_data: "menu_exams" },
      ],
      [
        { text: this.t(ctx, 'progress_btn'), callback_data: "menu_progress" },
        { text: this.t(ctx, 'profile_btn'), callback_data: "menu_profile" },
      ],
      [{ text: this.t(ctx, 'lang_btn'), callback_data: "lang_select" }],
    ];

    if (parents.length > 1) {
      inlineKeyboard.splice(3, 0, [
        { text: this.t(ctx, 'switch_child_btn'), callback_data: "switch_child" },
      ]);
    }

    return this.sendAndTrack(ctx, `${headerText}${this.t(ctx, 'menu_select')}`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: inlineKeyboard },
    });
  }

  // ─── /payments ─────────────────────────────────────────────
  private async handlePayments(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'payments');
    if (!studentId) return;

    const payments = await this.studentPaymentModel.findAll({
      where: { student_id: studentId },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const paymentStatus = await this.studentPaymentService.calculateStudentPaymentStatus(studentId);

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });

    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    const statusEmoji = paymentStatus.paymentStatus === "overdue" ? "🔴" : paymentStatus.daysUntilNextPayment <= 3 ? "🟡" : "🟢";
    const statusText = paymentStatus.paymentStatus === "overdue"
      ? this.t(ctx, 'status_overdue')
      : paymentStatus.daysUntilNextPayment <= 3
        ? this.t(ctx, 'status_pending')
        : this.t(ctx, 'status_paid');

    let text = `${this.t(ctx, 'payments_title')} — ${studentName}*\n\n`;
    text += `${this.t(ctx, 'total_paid')} *${paymentStatus.totalPaid?.toLocaleString() ?? 0} ${this.t(ctx, 'currency')}*\n`;
    text += `${statusEmoji} ${this.t(ctx, 'status_label')} *${statusText}*\n`;
    if (paymentStatus.pendingAmount > 0) {
      text += `${this.t(ctx, 'pending_amount')} *${paymentStatus.pendingAmount?.toLocaleString()} ${this.t(ctx, 'currency')}*\n`;
    }
    if (paymentStatus.nextPaymentDate) {
      text += `${this.t(ctx, 'next_payment')} *${new Date(paymentStatus.nextPaymentDate).toLocaleDateString("uz-UZ")}*`;
      if (paymentStatus.daysUntilNextPayment < 0) {
        text += ` _(${Math.abs(paymentStatus.daysUntilNextPayment)} ${this.t(ctx, 'days_overdue')})_`;
      } else if (paymentStatus.daysUntilNextPayment > 0) {
        text += ` _(${paymentStatus.daysUntilNextPayment} ${this.t(ctx, 'days_left')})_`;
      }
      text += `\n`;
    }
    text += `\n`;

    if (payments.length === 0) {
      text += this.t(ctx, 'no_payments');
    } else {
      text += `${this.t(ctx, 'recent_payments')}\n\n`;
      for (const p of payments) {
        const date = p.payment_date
          ? new Date(p.payment_date).toLocaleDateString("uz-UZ")
          : "—";
        const statusEmoji =
          p.status === "completed" ? "✅" : p.status === "pending" ? "⏳" : "❌";
        const pStatusText = p.status === "completed"
          ? this.t(ctx, 'pay_completed')
          : p.status === "pending"
            ? this.t(ctx, 'pay_pending')
            : this.t(ctx, 'pay_cancelled');
        text += `${statusEmoji} ${date} — *${p.amount?.toLocaleString()} ${this.t(ctx, 'currency')}*\n`;
        text += `   📌 ${p.payment_method} | ${pStatusText}\n`;
        if (p.next_payment_date) {
          text += `   ${this.t(ctx, 'next_payment')} ${new Date(p.next_payment_date).toLocaleDateString("uz-UZ")}\n`;
        }
        text += `\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /attendance ───────────────────────────────────────────
  private async handleAttendance(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'attendance');
    if (!studentId) return;

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    // Get last 30 days attendance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const records = await this.attendanceModel.findAll({
      where: {
        student_id: studentId,
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

    let text = `${this.t(ctx, 'attendance_title')} — ${studentName}*\n`;
    text += `${this.t(ctx, 'last_30')}\n\n`;
    text += `${this.t(ctx, 'stats')}\n`;
    text += `   ${this.t(ctx, 'present_days')} *${present}* ${this.t(ctx, 'streak_unit')}\n`;
    text += `   ${this.t(ctx, 'absent_days')} *${absent}* ${this.t(ctx, 'streak_unit')}\n`;
    text += `   ${this.t(ctx, 'late_days')} *${late}* ${this.t(ctx, 'streak_unit')}\n`;
    text += `   ${this.t(ctx, 'rate')} *${attendanceRate}%*\n\n`;

    if (records.length > 0) {
      text += `${this.t(ctx, 'recent_lessons')}\n\n`;
      for (const r of records.slice(0, 10)) {
        const date = new Date(r.date).toLocaleDateString("uz-UZ");
        const emoji = r.status === "present" ? "✅" : r.status === "absent" ? "❌" : "⏰";
        const groupName = groupMap.get(r.group_id) || "—";
        text += `${emoji} ${date} | ${groupName}\n`;
      }
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /grades ───────────────────────────────────────────────
  private async handleGrades(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'grades');
    if (!studentId) return;

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    const gradings = await this.gradingModel.findAll({
      where: { student_id: studentId },
      include: [{ model: Group, as: "group", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
      limit: 15,
    });

    let text = `${this.t(ctx, 'grades_title')} — ${studentName}*\n\n`;

    if (gradings.length === 0) {
      text += this.t(ctx, 'no_grades');
    } else {
      // Calculate average
      const avgGrade =
        gradings.reduce((sum, g) => sum + (g.grade || 0), 0) / gradings.length;
      const avgPercent =
        gradings.reduce((sum, g) => sum + (g.percent || 0), 0) /
        gradings.length;

      text += `${this.t(ctx, 'avg_grade')} *${avgGrade.toFixed(1)}/10* (${avgPercent.toFixed(0)}%)\n\n`;
      text += `${this.t(ctx, 'recent_grades')}\n\n`;

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
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'exams');
    if (!studentId) return;

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    const examResults = await this.examResultModel.findAll({
      where: { student_id: studentId },
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

    let text = `${this.t(ctx, 'exams_title')} — ${studentName}*\n\n`;

    if (examResults.length === 0) {
      text += this.t(ctx, 'no_exams');
    } else {
      for (const er of examResults) {
        const exam = examMap.get(er.exam_id);
        const resultEmoji = er.result === "passed" ? "✅" : "❌";
        const date = exam?.scheduled_at
          ? new Date(exam.scheduled_at).toLocaleDateString("uz-UZ")
          : "—";

        text += `${resultEmoji} *${exam?.title || this.t(ctx, 'exams_title').replace('📝 *', '').replace('*', '')}*\n`;
        text += `   📅 ${date} | ${exam?.level || "—"}\n`;
        text += `   ${this.t(ctx, 'score_label')} *${er.score}/${er.max_score}* (${er.percentage}%)\n`;

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
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'progress');
    if (!studentId) return;

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    // Student profile (gamification)
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: studentId },
    });

    // Groups the student belongs to
    const groupStudents = await this.groupStudentModel.findAll({
      where: { student_id: studentId, status: "active" },
      include: [{ model: this.groupModel, as: "group", attributes: ["name"] }],
    });

    // Course progress
    let courseProgressList: any[] = [];
    try {
      courseProgressList = await this.coursesService.getAllCourseProgress(studentId);
    } catch {
      // Student may not be in any English group
    }

    let text = `${this.t(ctx, 'progress_title')} — ${studentName}*\n\n`;

    // Profile stats
    if (profile) {
      const rank = await this.studentProfileModel.count({
        where: { points: { [Op.gt]: profile.points } },
      }) + 1;
      text += `${this.t(ctx, 'profile_section')}\n`;
      text += `   ${this.t(ctx, 'points_label')} ${profile.points}\n`;
      text += `   ${this.t(ctx, 'coins_label')} ${profile.coins}\n`;
      text += `   ${this.t(ctx, 'streak_label')} ${profile.streaks} ${this.t(ctx, 'streak_unit')}\n`;
      text += `   ${this.t(ctx, 'rank_label')} ${rank}${this.t(ctx, 'rank_suffix')}\n\n`;
    }

    // Active groups
    if (groupStudents.length > 0) {
      text += `${this.t(ctx, 'groups_section')}\n`;
      for (const gs of groupStudents) {
        const groupName = (gs as any).group?.name || "—";
        text += `   📖 ${groupName}\n`;
      }
      text += `\n`;
    }

    // Course progress
    if (courseProgressList.length > 0) {
      text += `${this.t(ctx, 'courses_section')}\n\n`;
      for (const cp of courseProgressList) {
        const progressEmoji = cp.percentage >= 100 ? "✅" : cp.percentage >= 50 ? "📗" : "📕";
        text += `${progressEmoji} *${cp.course_name}*\n`;
        text += `   📊 ${cp.completed}/${cp.total} ${this.t(ctx, 'lesson_unit')} — *${cp.percentage}%*\n\n`;
      }
    } else {
      text += `${this.t(ctx, 'no_courses')}\n`;
    }

    return this.sendAndTrack(ctx, text, { parse_mode: "Markdown" });
  }

  // ─── /profile ──────────────────────────────────────────────
  private async handleProfile(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;
    const studentId = await this.resolveStudentId(ctx, parents, 'profile');
    if (!studentId) return;

    const parentInfo = parents.find((p) => p.student_id === studentId) ?? parents[0];

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });
    const studentName = student
      ? `${student.first_name} ${student.last_name}`
      : this.t(ctx, 'unknown');

    const lastPayment = await this.studentPaymentModel.findOne({
      where: { student_id: studentId },
      order: [["createdAt", "DESC"]],
    });

    const profile = await this.studentProfileModel.findOne({
      where: { user_id: studentId },
    });

    const paymentStatus = await this.studentPaymentService.calculateStudentPaymentStatus(studentId);
    const statusEmoji = paymentStatus.paymentStatus === "overdue" ? "🔴" : paymentStatus.daysUntilNextPayment <= 3 ? "🟡" : "🟢";
    const statusText = paymentStatus.paymentStatus === "overdue"
      ? this.t(ctx, 'status_overdue')
      : paymentStatus.daysUntilNextPayment <= 3
        ? this.t(ctx, 'status_pending')
        : this.t(ctx, 'status_paid');

    let text = `${this.t(ctx, 'profile_title')}\n\n`;
    text += `${this.t(ctx, 'parent_name')} *${parentInfo.full_name}*\n`;
    text += `${this.t(ctx, 'phone_label')} ${parentInfo.phone_number}\n`;
    text += `${this.t(ctx, 'student_label')} *${studentName}*\n`;
    if (lastPayment) {
      text += `${this.t(ctx, 'last_payment')} *${lastPayment.amount?.toLocaleString() ?? 0} ${this.t(ctx, 'currency')}*\n`;
    }
    text += `${statusEmoji} ${this.t(ctx, 'payment_status')} *${statusText}*\n`;
    if (profile) {
      const rank = await this.studentProfileModel.count({
        where: { points: { [Op.gt]: profile.points } },
      }) + 1;
      text += `${this.t(ctx, 'points_label')} ${profile.points} | ${this.t(ctx, 'coins_label')} ${profile.coins}\n`;
      text += `${this.t(ctx, 'streak_label')} ${profile.streaks} ${this.t(ctx, 'streak_unit')} | ${this.t(ctx, 'rank_label')} ${rank}${this.t(ctx, 'rank_suffix')}\n`;
    }

    return this.sendAndTrack(ctx, text, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: this.t(ctx, 'unlink_btn'),
              callback_data: "confirm_unlink",
            },
          ],
          [{ text: this.t(ctx, 'back_btn'), callback_data: "menu_back" }],
        ],
      },
    });
  }

  // ─── /unlink ───────────────────────────────────────────────
  private async handleUnlink(ctx: Context) {
    const parents = await this.getLinkedParents(ctx);
    if (!parents.length) return;

    const warning =
      parents.length > 1
        ? this.t(ctx, 'unlink_warning_multi').replace('{count}', String(parents.length))
        : this.t(ctx, 'unlink_warning_single');

    return this.sendAndTrack(ctx, warning, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: this.t(ctx, 'yes_unlink'), callback_data: "do_unlink" },
              { text: this.t(ctx, 'no_btn'), callback_data: "menu_back" },
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
      `${this.t(ctx, 'help_title')}\n\n` +
        `${this.t(ctx, 'help_body')}\n\n` +
        `${this.t(ctx, 'help_commands')}\n` +
        `${this.t(ctx, 'help_menu')}\n` +
        `${this.t(ctx, 'help_payments')}\n` +
        `${this.t(ctx, 'help_attendance')}\n` +
        `${this.t(ctx, 'help_grades')}\n` +
        `${this.t(ctx, 'help_exams')}\n` +
        `${this.t(ctx, 'help_progress')}\n` +
        `${this.t(ctx, 'help_profile')}\n` +
        `${this.t(ctx, 'help_unlink')}\n` +
        `${this.t(ctx, 'help_helpCmd')}\n\n` +
        `${this.t(ctx, 'help_contact')}`,
      { parse_mode: "Markdown" },
    );
  }

  // ─── Callback queries from inline keyboard ─────────────────
  private async handleCallbackQuery(ctx: Context) {
    const callbackQuery = ctx.callbackQuery as any;
    const data = callbackQuery?.data;
    if (!data) return;

    await ctx.answerCbQuery();

    // Handle child selection: child_{studentId}_{command}
    if (data.startsWith('child_')) {
      const withoutPrefix = data.slice('child_'.length);
      const lastUnderscore = withoutPrefix.lastIndexOf('_');
      const studentId = withoutPrefix.slice(0, lastUnderscore);
      const command = withoutPrefix.slice(lastUnderscore + 1);
      this.selectedChild.set(String(ctx.chat!.id), studentId);
      switch (command) {
        case 'payments': return this.handlePayments(ctx);
        case 'attendance': return this.handleAttendance(ctx);
        case 'grades': return this.handleGrades(ctx);
        case 'exams': return this.handleExams(ctx);
        case 'progress': return this.handleProgress(ctx);
        case 'profile': return this.handleProfile(ctx);
        default: return this.handleMenu(ctx);
      }
    }

    switch (data) {
      case "menu_payments": {
        this.selectedChild.delete(String(ctx.chat!.id));
        return this.handlePayments(ctx);
      }
      case "menu_attendance": {
        this.selectedChild.delete(String(ctx.chat!.id));
        return this.handleAttendance(ctx);
      }
      case "menu_grades": {
        this.selectedChild.delete(String(ctx.chat!.id));
        return this.handleGrades(ctx);
      }
      case "menu_exams": {
        this.selectedChild.delete(String(ctx.chat!.id));
        return this.handleExams(ctx);
      }
      case "menu_progress": {
        this.selectedChild.delete(String(ctx.chat!.id));
        return this.handleProgress(ctx);
      }
      case "menu_profile":
        return this.handleProfile(ctx);
      case "menu_back":
        return this.handleMenu(ctx);
      case "confirm_unlink":
        return this.handleUnlink(ctx);
      case "lang_select":
        return this.sendLanguageSelector(ctx);
      case "lang_uz":
      case "lang_en":
      case "lang_ru": {
        const chatId = String(ctx.chat!.id);
        const lang = data.slice(5) as Lang;
        this.userLanguage.set(chatId, lang);
        await ctx.answerCbQuery(T[lang]['lang_set']);
        return this.handleStart(ctx);
      }
      case "link_more_children": {
        await this.sendAndTrack(
          ctx,
          this.t(ctx, 'link_more_prompt'),
          {
            parse_mode: "Markdown",
            reply_markup: {
              keyboard: [
                [{ text: this.t(ctx, 'share_phone_btn'), request_contact: true }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          },
        );
        return;
      }
      case "switch_child": {
        const chatId = String(ctx.chat!.id);
        this.selectedChild.delete(chatId);
        const parents = await this.getLinkedParents(ctx);
        if (!parents.length) return;
        return this.showChildSelector(ctx, parents, 'menu');
      }
      case "do_unlink": {
        const chatId = String(ctx.chat!.id);
        const parentsToUnlink = await this.studentParentModel.findAll({
          where: { telegram_chat_id: chatId },
        });
        await Promise.all(parentsToUnlink.map((p) => p.update({ telegram_chat_id: null })));
        this.selectedChild.delete(chatId);
        this.lastBotMessage.delete(chatId);
        return ctx.reply(this.t(ctx, 'unlinked'));
      }
      default:
        return;
    }
  }

  // ─── Helpers: multi-child support ──────────────────────────
  /** Returns all StudentParent records linked to this chat, or [] (with prompt) if none. */
  private async getLinkedParents(ctx: Context): Promise<StudentParent[]> {
    const chatId = String(ctx.chat!.id);
    const parents = await this.studentParentModel.findAll({
      where: { telegram_chat_id: chatId },
    });
    if (parents.length === 0) {
      await ctx.reply(this.t(ctx, 'not_registered'));
    }
    return parents;
  }

  /** If one child, returns their student_id immediately.
   *  If multiple children, checks selected child or shows a selector keyboard.
   *  Returns null when a selector was shown — caller must return. */
  private async resolveStudentId(
    ctx: Context,
    parents: StudentParent[],
    command: string,
  ): Promise<string | null> {
    if (parents.length === 1) {
      return parents[0].student_id;
    }
    const chatId = String(ctx.chat!.id);
    const selected = this.selectedChild.get(chatId);
    if (selected && parents.some((p) => p.student_id === selected)) {
      return selected;
    }
    await this.showChildSelector(ctx, parents, command);
    return null;
  }

  /** Sends an inline keyboard listing all children for the parent to pick from. */
  private async showChildSelector(
    ctx: Context,
    parents: StudentParent[],
    command: string,
  ): Promise<void> {
    const students = await this.userModel.findAll({
      where: { user_id: parents.map((p) => p.student_id) },
      attributes: ["user_id", "first_name", "last_name"],
    });
    const studentMap = new Map(students.map((s) => [s.user_id, s]));

    const buttons = parents.map((p) => {
      const student = studentMap.get(p.student_id);
      const name = student
        ? `${student.first_name} ${student.last_name}`
        : this.t(ctx, 'unknown');
      return [{ text: `👨‍🎓 ${name}`, callback_data: `child_${p.student_id}_${command}` }];
    });

    await this.sendAndTrack(ctx, this.t(ctx, 'child_selector'), {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    });
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

  /** Send a per-language notification to each parent of a student. */
  private async sendNotificationToParentLocalized(
    studentId: string,
    buildMessage: (lang: Lang, studentName: string) => string,
  ): Promise<void> {
    const parents = await this.studentParentModel.findAll({
      where: {
        student_id: studentId,
        telegram_chat_id: { [Op.ne]: null },
      },
    });

    const student = await this.userModel.findByPk(studentId, {
      attributes: ["first_name", "last_name"],
    });

    for (const parent of parents) {
      try {
        const lang = this.userLanguage.get(parent.telegram_chat_id!) ?? 'uz';
        const studentName = student
          ? `${student.first_name} ${student.last_name}`
          : T[lang]['unknown'];
        const message = buildMessage(lang, studentName);
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

  /** Notify parent when attendance is recorded */
  async notifyAttendance(
    studentId: string,
    status: string,
    date: string,
    groupName?: string,
  ): Promise<void> {
    const formattedDate = new Date(date).toLocaleDateString("uz-UZ");
    const group = groupName ? ` | 📚 ${groupName}` : "";

    await this.sendNotificationToParentLocalized(studentId, (lang, studentName) => {
      const l = T[lang];
      const emoji = status === "present" ? "✅" : status === "absent" ? "❌" : "⏰";
      const statusText = status === "present"
        ? l['att_present']
        : status === "absent"
          ? l['att_absent']
          : l['att_late'];
      return (
        `${l['notif_attendance_title']}\n\n` +
        `${l['notif_child']} *${studentName}*\n` +
        `${emoji} ${l['notif_status']} *${statusText}*\n` +
        `${l['notif_date']} ${formattedDate}${group}`
      );
    });
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
    await this.sendNotificationToParentLocalized(studentId, (lang, studentName) => {
      const l = T[lang];
      const gradeEmoji = grade >= 8 ? "🌟" : grade >= 5 ? "📗" : "📕";
      let message =
        `${l['notif_grade_title']}\n\n` +
        `${l['notif_child']} *${studentName}*\n` +
        `${gradeEmoji} ${l['notif_grade']} *${grade}/10* (${percent}%)`;
      if (groupName) message += `\n${l['notif_group']} ${groupName}`;
      if (lessonName) message += `\n${l['notif_lesson']} ${lessonName}`;
      if (note) message += `\n${l['notif_teacher_note']} ${note}`;
      return message;
    });
  }

  /** Notify parent when a payment is made */
  async notifyPayment(
    studentId: string,
    amount: number,
    status: string,
    paymentMethod: string,
    nextPaymentDate?: string,
  ): Promise<void> {
    await this.sendNotificationToParentLocalized(studentId, (lang, studentName) => {
      const l = T[lang];
      const statusEmoji = status === "completed" ? "✅" : status === "pending" ? "⏳" : "❌";
      const statusText = status === "completed"
        ? l['pay_completed']
        : status === "pending"
          ? l['pay_pending']
          : l['pay_cancelled'];
      let message =
        `${l['notif_payment_title']}\n\n` +
        `${l['notif_child']} *${studentName}*\n` +
        `${statusEmoji} ${l['notif_status']} *${statusText}*\n` +
        `${l['notif_amount']} *${amount?.toLocaleString()} ${l['currency']}*\n` +
        `${l['notif_method']} ${paymentMethod}`;
      if (nextPaymentDate) {
        message += `\n${l['notif_next_date']} ${new Date(nextPaymentDate).toLocaleDateString("uz-UZ")}`;
      }
      return message;
    });
  }
}
