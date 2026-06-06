import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron } from "@nestjs/schedule";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
import { Group, DaysEnum } from "../groups/entities/group.entity.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { Op } from "sequelize";

@Injectable()
export class LessonSchedulesService {
  private readonly logger = new Logger(LessonSchedulesService.name);

  constructor(
    @InjectModel(LessonSchedule)
    private lessonScheduleModel: typeof LessonSchedule,
    @InjectModel(Group)
    private groupModel: typeof Group,
    private notificationsService: NotificationsService,
  ) {}

  async create(createLessonScheduleDto: CreateLessonScheduleDto) {
    return await this.lessonScheduleModel.create(createLessonScheduleDto as any);
  }

  async findAll() {
    return await this.lessonScheduleModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string) {
    const lessonSchedule = await this.lessonScheduleModel.findByPk(id, {
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });

    if (!lessonSchedule) {
      throw new NotFoundException(`Lesson schedule with ID ${id} not found`);
    }

    return lessonSchedule;
  }

  async findByGroupId(groupId: string) {
    return await this.lessonScheduleModel.findAll({
      where: { group_id: groupId },
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }

  async findByTeacherId(teacherId: string) {
    return await this.lessonScheduleModel.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "group",
          where: { teacher_id: teacherId },
          required: true,
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }

  async update(id: string, updateLessonScheduleDto: UpdateLessonScheduleDto) {
    const lessonSchedule = await this.findOne(id);
    await lessonSchedule.update(updateLessonScheduleDto as any);
    return lessonSchedule;
  }

  async remove(id: string) {
    const lessonSchedule = await this.findOne(id);
    await lessonSchedule.destroy();
    return { id, deleted: true };
  }

  // Runs Mon–Sat at 09:00, 13:00, 17:00 Tashkent time (UTC+5 → 04:00, 08:00, 12:00 UTC)
  @Cron("0 4,8,12 * * 1-6")
  async handleLessonScheduleReminder() {
    try {
      // Resolve "today" in Tashkent time (UTC+5)
      const now = new Date();
      const tashkentTime = new Date(
        now.getTime() + (5 * 60 + now.getTimezoneOffset()) * 60_000,
      );
      const today = tashkentTime.toISOString().split("T")[0];
      const dayOfMonth = tashkentTime.getDate();
      const todayDayTypes =
        dayOfMonth % 2 !== 0
          ? [DaysEnum.ODD, DaysEnum.EVERY_DAY]
          : [DaysEnum.EVEN, DaysEnum.EVERY_DAY];

      // Only groups that should have a lesson today (by odd/even pattern)
      const todayGroups = await this.groupModel.findAll({
        where: {
          teacher_id: { [Op.not]: null },
          days: { [Op.in]: todayDayTypes },
          isDeleted: false,
          isIELTS: false,
        },
        attributes: ["id", "teacher_id", "name"],
      });

      if (todayGroups.length === 0) return;

      // Which of those groups already have a schedule entered for today
      const scheduledGroupIds = new Set(
        (
          await this.lessonScheduleModel.findAll({
            where: {
              date: today,
              group_id: { [Op.in]: todayGroups.map((g) => g.id) },
            },
            attributes: ["group_id"],
          })
        ).map((s) => s.group_id),
      );

      // Map teacher_id → list of group names missing a schedule
      const teacherMissingGroups = new Map<string, string[]>();
      for (const group of todayGroups) {
        if (!scheduledGroupIds.has(group.id)) {
          if (!teacherMissingGroups.has(group.teacher_id)) {
            teacherMissingGroups.set(group.teacher_id, []);
          }
          teacherMissingGroups.get(group.teacher_id)!.push(group.name);
        }
      }

      if (teacherMissingGroups.size === 0) {
        this.logger.log(`[${today}] All today's groups have schedules`);
        return;
      }

      const tokenRecords = await NotificationToken.findAll({
        where: { user_id: { [Op.in]: [...teacherMissingGroups.keys()] } },
      });

      let sent = 0;
      for (const tokenRecord of tokenRecords) {
        const missing = teacherMissingGroups.get(tokenRecord.user_id);
        if (!missing) continue;

        const groupList = missing.join(", ");
        await this.notificationsService.notifyUser(
          tokenRecord.token,
          "Dars jadvali kiritilmagan",
          `Bugun uchun quyidagi guruh(lar)da jadval kiritilmagan: ${groupList}`,
          { type: "lesson_schedule_reminder", screen: "leaderboard" },
        );
        sent++;
      }

      const totalMissing = [...teacherMissingGroups.values()].flat().length;
      this.logger.log(
        `[${today}] Schedule reminders sent: ${sent} teachers, ${totalMissing} groups without schedule`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending lesson schedule reminders: ${(error as any).message}`,
      );
    }
  }

  async findActiveSchedules() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format

    return await this.lessonScheduleModel.findAll({
      where: {
        date: {
          [Op.gte]: currentDate,
        },
      },
      order: [["date", "ASC"]],
      include: [
        {
          association: "group",
          include: [
            {
              association: "teacher",
              attributes: {
                exclude: ["password_hash"],
              },
            },
          ],
        },
      ],
    });
  }
}
