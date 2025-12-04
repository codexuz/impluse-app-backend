import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CreateLeadTrialLessonDto } from "./dto/create-lead-trial-lesson.dto.js";
import { UpdateLeadTrialLessonDto } from "./dto/update-lead-trial-lesson.dto.js";
import { LeadTrialLesson } from "./entities/lead-trial-lesson.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Lead } from "../leads/entities/lead.entity.js";
import { Op } from "sequelize";
import { SmsService } from "../sms/sms.service.js";

@Injectable()
export class LeadTrialLessonsService {
  private readonly logger = new Logger(LeadTrialLessonsService.name);

  constructor(
    @InjectModel(LeadTrialLesson)
    private trialLessonModel: typeof LeadTrialLesson,
    @InjectModel(Lead)
    private leadModel: typeof Lead,
    private readonly smsService: SmsService
  ) {}

  private getIncludeOptions() {
    return [
      {
        model: User,
        as: "teacherInfo",
        attributes: ["user_id", "first_name", "last_name", "username", "phone"],
        required: false,
      },
      {
        model: Lead,
        as: "leadInfo",
        attributes: ["id", "first_name", "last_name", "phone", "status"],
        required: false,
      },
    ];
  }

  async create(
    createLeadTrialLessonDto: CreateLeadTrialLessonDto
  ): Promise<LeadTrialLesson> {
    try {
      return await this.trialLessonModel.create({
        ...createLeadTrialLessonDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
    teacherId?: string
  ): Promise<{
    trialLessons: LeadTrialLesson[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};
    const includeOptions = this.getIncludeOptions();

    if (search) {
      whereClause[Op.or] = [
        { notes: { [Op.like]: `%${search}%` } },
        { "$teacherInfo.first_name$": { [Op.like]: `%${search}%` } },
        { "$teacherInfo.last_name$": { [Op.like]: `%${search}%` } },
        { "$teacherInfo.username$": { [Op.like]: `%${search}%` } },
        { "$leadInfo.first_name$": { [Op.like]: `%${search}%` } },
        { "$leadInfo.last_name$": { [Op.like]: `%${search}%` } },
        { "$leadInfo.phone$": { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (teacherId) {
      whereClause.teacher_id = teacherId;
    }

    const { count, rows } = await this.trialLessonModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["scheduledAt", "DESC"]],
      include: includeOptions,
      distinct: true,
    });

    return {
      trialLessons: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<LeadTrialLesson> {
    const trialLesson = await this.trialLessonModel.findByPk(id, {
      include: this.getIncludeOptions(),
    });
    if (!trialLesson) {
      throw new NotFoundException(`Trial lesson with ID ${id} not found`);
    }
    return trialLesson;
  }

  async findByStatus(status: string): Promise<LeadTrialLesson[]> {
    return await this.trialLessonModel.findAll({
      where: { status },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
  }

  async findByTeacher(teacherId: string): Promise<LeadTrialLesson[]> {
    return await this.trialLessonModel.findAll({
      where: { teacher_id: teacherId },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
  }

  async findByLead(leadId: string): Promise<LeadTrialLesson[]> {
    // Use our custom model query that uses the correct aliases
    return await this.trialLessonModel.findAll({
      where: { lead_id: leadId },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
  }

  async findUpcoming(limit = 20): Promise<LeadTrialLesson[]> {
    return await this.trialLessonModel.findAll({
      where: {
        scheduledAt: {
          [Op.gte]: new Date(),
        },
        status: "belgilangan",
      },
      limit,
      order: [["scheduledAt", "ASC"]],
      include: this.getIncludeOptions(),
    });
  }

  async update(
    id: string,
    updateLeadTrialLessonDto: UpdateLeadTrialLessonDto
  ): Promise<LeadTrialLesson> {
    const trialLesson = await this.findOne(id);
    return await trialLesson.update(updateLeadTrialLessonDto);
  }

  async remove(id: string): Promise<void> {
    const trialLesson = await this.findOne(id);
    await trialLesson.destroy();
  }

  async getTrialLessonStats(): Promise<{
    totalTrialLessons: number;
    trialLessonsByStatus: { [key: string]: number };
    trialLessonsByTeacher: {
      [key: string]: { count: number; teacherName: string };
    };
    upcomingTrialLessons: number;
  }> {
    const totalTrialLessons = await this.trialLessonModel.count();

    const statusStats = await this.trialLessonModel.findAll({
      attributes: [
        "status",
        [
          this.trialLessonModel.sequelize.fn(
            "COUNT",
            this.trialLessonModel.sequelize.col("status")
          ),
          "count",
        ],
      ],
      group: ["status"],
      raw: true,
    });

    const teacherStats = await this.trialLessonModel.findAll({
      attributes: [
        "teacher_id",
        [
          this.trialLessonModel.sequelize.fn(
            "COUNT",
            this.trialLessonModel.sequelize.col("teacher_id")
          ),
          "count",
        ],
      ],
      include: [
        {
          model: User,
          as: "teacherInfo",
          attributes: ["first_name", "last_name", "username"],
        },
      ],
      group: [
        "teacher_id",
        "teacherInfo.user_id",
        "teacherInfo.first_name",
        "teacherInfo.last_name",
        "teacherInfo.username",
      ],
      raw: false,
    });

    const upcomingTrialLessons = await this.trialLessonModel.count({
      where: {
        scheduledAt: {
          [Op.gte]: new Date(),
        },
        status: "belgilangan",
      },
    });

    const trialLessonsByStatus = statusStats.reduce((acc: any, stat: any) => {
      acc[stat.status] = parseInt(stat.count);
      return acc;
    }, {});

    const trialLessonsByTeacher = teacherStats.reduce((acc: any, stat: any) => {
      const teacherName = stat.teacherInfo
        ? `${stat.teacherInfo.first_name} ${stat.teacherInfo.last_name} (${stat.teacherInfo.username})`
        : "Unknown Teacher";
      acc[stat.teacher_id] = {
        count: parseInt(stat.get("count") as string),
        teacherName: teacherName,
      };
      return acc;
    }, {});

    return {
      totalTrialLessons,
      trialLessonsByStatus,
      trialLessonsByTeacher,
      upcomingTrialLessons,
    };
  }

  /**
   * Cron job to send SMS reminders for trial lessons scheduled today
   * Runs every day at 7:00 AM
   */
  @Cron("0 7 * * *", {
    name: "trial-lesson-sms-reminder",
    timeZone: "Asia/Tashkent",
  })
  async sendTrialLessonReminders(): Promise<void> {
    this.logger.log("Starting trial lesson SMS reminder job");

    try {
      // Get today's date range (start and end of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find all trial lessons scheduled for today with status "belgilangan"
      const todayTrialLessons = await this.trialLessonModel.findAll({
        where: {
          scheduledAt: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
          status: "belgilangan",
        },
        include: [
          {
            model: Lead,
            as: "leadInfo",
            attributes: ["id", "first_name", "last_name", "phone"],
          },
        ],
      });

      this.logger.log(
        `Found ${todayTrialLessons.length} trial lessons scheduled for today`
      );

      // Send SMS to each student
      for (const lesson of todayTrialLessons) {
        try {
          await this.sendTrialLessonSms(lesson);
        } catch (error) {
          // Log error but continue with other students
          this.logger.error(
            `Failed to send SMS for trial lesson ${lesson.id}:`,
            error
          );
        }
      }

      this.logger.log("Trial lesson SMS reminder job completed");
    } catch (error) {
      this.logger.error("Error in trial lesson SMS reminder job:", error);
    }
  }

  /**
   * Send trial lesson reminder SMS to a student
   * @param lesson - The trial lesson record
   */
  private async sendTrialLessonSms(
    lesson: LeadTrialLesson
  ): Promise<void> {
    try {
      if (!lesson.leadInfo) {
        this.logger.warn(
          `Lead info not found for trial lesson ${lesson.id}`
        );
        return;
      }

      const lead = lesson.leadInfo;

      if (!lead.phone) {
        this.logger.warn(
          `Lead ${lead.first_name} ${lead.last_name} has no phone number`
        );
        return;
      }

      // Format time as HH:MM
      const formatTime = (date: Date): string => {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const lessonTime = formatTime(lesson.scheduledAt);

      // Build SMS message
      const message = `Assalomu alaykum, ${lead.first_name} ${lead.last_name}! Bugun soat ${lessonTime} da sinov darsiga o'z vaqtida kelishni unutmang. Impulse Study LC`;

      // Send SMS
      await this.smsService.sendSms({
        mobile_phone: lead.phone,
        message: message,
      });

      this.logger.log(
        `Trial lesson SMS sent successfully to ${lead.first_name} ${lead.last_name} (${lead.phone}) for lesson at ${lessonTime}`
      );
    } catch (error) {
      // Re-throw to be caught by the caller's catch block
      throw error;
    }
  }
}
