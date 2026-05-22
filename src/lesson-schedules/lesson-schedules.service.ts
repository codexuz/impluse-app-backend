import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron } from "@nestjs/schedule";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
import { Group } from "../groups/entities/group.entity.js";
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

  // Runs Mon–Sat at 09:00, 13:00, 17:00 — stops reminding once the teacher has
  // added at least one schedule for today.
  @Cron("0 9,13,17 * * 1-6")
  async handleLessonScheduleReminder() {
    this.logger.log("Checking teachers without a lesson schedule for today");

    try {
      const today = new Date().toISOString().split("T")[0];

      // All groups that have an assigned teacher
      const groups = await this.groupModel.findAll({
        where: { teacher_id: { [Op.not]: null } },
        attributes: ["id", "teacher_id", "name"],
      });

      if (groups.length === 0) return;

      // Group IDs that already have a schedule for today
      const scheduledGroupIds = new Set(
        (await this.lessonScheduleModel.findAll({
          where: { date: today },
          attributes: ["group_id"],
        })).map((s) => s.group_id),
      );

      // Collect teacher IDs whose groups have NO schedule today
      const unscheduledTeacherIds = new Set<string>();
      for (const group of groups) {
        if (!scheduledGroupIds.has(group.id)) {
          unscheduledTeacherIds.add(group.teacher_id);
        }
      }

      if (unscheduledTeacherIds.size === 0) {
        this.logger.log("All teachers have added lesson schedules for today");
        return;
      }

      const tokenRecords = await NotificationToken.findAll({
        where: { user_id: { [Op.in]: [...unscheduledTeacherIds] } },
      });

      let sent = 0;
      for (const tokenRecord of tokenRecords) {
        await this.notificationsService.notifyUser(
          tokenRecord.token,
          "Dars jadvali eslatmasi",
          "Bugun uchun dars jadvalini hali qo'shmagansiz. Iltimos, jadval qo'shing.",
          { type: "lesson_schedule_reminder", screen: "leaderboard" },
        );
        sent++;
      }

      this.logger.log(
        `Lesson schedule reminders sent to ${sent} of ${unscheduledTeacherIds.size} teachers`,
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
