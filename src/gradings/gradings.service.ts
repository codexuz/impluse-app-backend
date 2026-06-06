import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron } from "@nestjs/schedule";
import { Grading } from "./entities/grading.entity.js";
import { CreateGradingDto } from "./dto/create-grading.dto.js";
import { UpdateGradingDto } from "./dto/update-grading.dto.js";
import { User } from "../users/entities/user.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { TelegramBotService } from "../telegram-bot/telegram-bot.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { Op } from "sequelize";

@Injectable()
export class GradingsService {
  private readonly logger = new Logger(GradingsService.name);

  constructor(
    @InjectModel(Grading)
    private gradingModel: typeof Grading,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    private telegramBotService: TelegramBotService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createGradingDto: CreateGradingDto): Promise<Grading> {
    const { student_id, teacher_id, group_id } = createGradingDto;
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingGrading = await this.gradingModel.findOne({
      where: {
        student_id,
        teacher_id,
        group_id,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (existingGrading) {
      throw new ConflictException(
        `User has already been graded for this group and teacher today`
      );
    }

    const grading = await this.gradingModel.create(createGradingDto as any);

    // Telegram notification to parent (non-blocking)
    this.telegramBotService
      .notifyGrading(
        createGradingDto.student_id,
        createGradingDto.grade,
        createGradingDto.percent,
        undefined,
        createGradingDto.lesson_name,
        createGradingDto.note,
      )
      .catch((e) => console.error("Telegram grading notification failed:", e));

    // Push notification to student (non-blocking)
    this.sendGradePushToStudent(grading).catch((e) =>
      this.logger.error(`Failed to send grade push to student ${grading.student_id}: ${e}`),
    );

    return grading;
  }

  async findAll(
    studentId?: string,
    teacherId?: string,
    groupId?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Grading[]; total: number; page: number; limit: number; totalPages: number }> {
    const whereClause: any = {};
    if (studentId) whereClause.student_id = studentId;
    if (teacherId) whereClause.teacher_id = teacherId;
    if (groupId) whereClause.group_id = groupId;

    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.gradingModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByStudentId(
    studentId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Grading[]; total: number; page: number; limit: number; totalPages: number }> {
    const whereClause: any = { student_id: studentId };
    
    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.gradingModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Grading> {
    const grading = await this.gradingModel.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!grading) {
      throw new NotFoundException(`Grading with ID ${id} not found`);
    }

    return grading;
  }

  async update(
    id: string,
    updateGradingDto: UpdateGradingDto
  ): Promise<Grading> {
    const grading = await this.findOne(id);

    await grading.update(updateGradingDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const grading = await this.findOne(id);
    await grading.destroy();
  }

  // ─── Student grade push ───────────────────────────────────────────────────

  private async sendGradePushToStudent(grading: Grading): Promise<void> {
    const tokenRecord = await NotificationToken.findOne({
      where: { user_id: grading.student_id },
    });
    if (!tokenRecord) return;

    const lesson = grading.lesson_name ? ` — ${grading.lesson_name}` : "";
    const note = grading.note ? ` "${grading.note}"` : "";

    await this.notificationsService.notifyUser(
      tokenRecord.token,
      "Yangi baho qo'yildi",
      `Bahoyingiz: ${grading.grade}/10 (${grading.percent}%)${lesson}${note}`,
      { type: "grade_received", screen: "progress", grading_id: grading.id },
    );
  }

  // ─── Teacher grading reminder crons ──────────────────────────────────────

  // 10:00 Tashkent = 05:00 UTC
  @Cron("0 5 * * 1-6")
  async handleTeacherGradingReminder10() {
    await this.sendTeacherGradingReminders(10);
  }

  // 15:00 Tashkent = 10:00 UTC
  @Cron("0 10 * * 1-6")
  async handleTeacherGradingReminder15() {
    await this.sendTeacherGradingReminders(15);
  }

  // 18:00 Tashkent = 13:00 UTC
  @Cron("0 13 * * 1-6")
  async handleTeacherGradingReminder18() {
    await this.sendTeacherGradingReminders(18);
  }

  // Returns the `days` enum values that match today's weekday.
  // odd  = Mon/Wed/Fri (JS getDay: 1, 3, 5)
  // even = Tue/Thu/Sat (JS getDay: 2, 4, 6)
  // Returns null on Sunday when no groups meet.
  private getTodayApplicableDays(): string[] | null {
    const dow = new Date().getDay(); // 0=Sun … 6=Sat
    if (dow === 0) return null;
    return dow % 2 === 1 ? ["odd", "every_day"] : ["even", "every_day"];
  }

  private async sendTeacherGradingReminders(localHour: number): Promise<void> {
    this.logger.log(`Sending grading reminders to teachers at local ${localHour}:00`);

    try {
      const applicableDays = this.getTodayApplicableDays();
      if (!applicableDays) {
        this.logger.log("Sunday — no grading reminders sent");
        return;
      }

      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Find all non-deleted groups with lessons today that have a teacher assigned
      const todayGroups = await this.groupModel.findAll({
        where: {
          days: { [Op.in]: applicableDays },
          isDeleted: false,
          isIELTS: false,
          teacher_id: { [Op.ne]: null },
        },
        attributes: ["id", "name", "teacher_id"],
      });

      if (todayGroups.length === 0) return;

      const groupIds = todayGroups.map((g) => g.id);

      // Map teacher → their groups today
      const groupsByTeacher = new Map<string, { id: string; name: string }[]>();
      for (const group of todayGroups) {
        const list = groupsByTeacher.get(group.teacher_id) ?? [];
        list.push({ id: group.id, name: group.name });
        groupsByTeacher.set(group.teacher_id, list);
      }

      // Active students per group
      const activeEnrollments = await this.groupStudentModel.findAll({
        where: { group_id: { [Op.in]: groupIds }, status: "active" },
        attributes: ["group_id", "student_id"],
      });
      const studentsByGroup = new Map<string, Set<string>>();
      for (const e of activeEnrollments) {
        const s = studentsByGroup.get(e.group_id) ?? new Set<string>();
        s.add(e.student_id);
        studentsByGroup.set(e.group_id, s);
      }

      // Graded students per group today
      const todayGradings = await this.gradingModel.findAll({
        where: {
          group_id: { [Op.in]: groupIds },
          createdAt: { [Op.between]: [startOfDay, endOfDay] },
        },
        attributes: ["group_id", "student_id"],
      });
      const gradedByGroup = new Map<string, Set<string>>();
      for (const g of todayGradings) {
        const s = gradedByGroup.get(g.group_id) ?? new Set<string>();
        s.add(g.student_id);
        gradedByGroup.set(g.group_id, s);
      }

      // Notification tokens
      const teacherIds = [...groupsByTeacher.keys()];
      const tokenRecords = await NotificationToken.findAll({
        where: { user_id: { [Op.in]: teacherIds } },
      });
      const tokenByTeacher = new Map(tokenRecords.map((t) => [t.user_id, t.token]));

      const timeLabel =
        localHour === 10 ? "ertalab" : localHour === 15 ? "tushdan keyin" : "kechqurun";

      let sent = 0;
      for (const [teacherId, groups] of groupsByTeacher) {
        const token = tokenByTeacher.get(teacherId);
        if (!token) continue;

        // Keep only groups where at least one active student is ungraded today
        const ungradedGroups = groups.filter((group) => {
          const total = studentsByGroup.get(group.id)?.size ?? 0;
          if (total === 0) return false;
          const graded = gradedByGroup.get(group.id)?.size ?? 0;
          return graded < total;
        });

        if (ungradedGroups.length === 0) continue;

        const groupNames = ungradedGroups.map((g) => `"${g.name}"`).join(", ");
        const body =
          ungradedGroups.length === 1
            ? `${ungradedGroups[0].name} guruhidagi barcha o'quvchilar hali baholanmagan.`
            : `Quyidagi guruhlarda baholanmagan o'quvchilar bor: ${groupNames}.`;

        await this.notificationsService.notifyUser(
          token,
          `Baholash eslatmasi (${timeLabel})`,
          body,
          { type: "grading_reminder", screen: "home" },
        );
        sent++;
      }

      this.logger.log(`Grading reminders sent to ${sent} teachers`);
    } catch (error) {
      this.logger.error(
        `Error sending teacher grading reminders: ${(error as any).message}`,
      );
    }
  }
}
