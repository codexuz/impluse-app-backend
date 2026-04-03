import { Injectable, NotFoundException, Logger, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
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
    private readonly smsService: SmsService,
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
    createLeadTrialLessonDto: CreateLeadTrialLessonDto,
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
    teacherId?: string,
    isNotified?: boolean,
  ): Promise<{
    trialLessons: LeadTrialLesson[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};
    const includeOptions = this.getIncludeOptions();

    // Filter by current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    whereClause.scheduledAt = {
      [Op.between]: [startOfMonth, endOfMonth],
    };

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

    if (isNotified !== undefined) {
      whereClause.isNotified = isNotified;
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
    updateLeadTrialLessonDto: UpdateLeadTrialLessonDto,
  ): Promise<LeadTrialLesson> {
    const trialLesson = await this.findOne(id);
    return await trialLesson.update(updateLeadTrialLessonDto);
  }

  async remove(id: string): Promise<void> {
    const trialLesson = await this.findOne(id);
    await trialLesson.destroy();
  }

  async sendManualReminder(id: string): Promise<{ success: boolean; message: string }> {
    const lesson = await this.findOne(id);
    await this.sendTrialLessonSms(lesson);
    await lesson.update({ isNotified: true });
    return { success: true, message: "SMS reminder sent successfully" };
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
            this.trialLessonModel.sequelize.col("status"),
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
            this.trialLessonModel.sequelize.col("teacher_id"),
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



  async getLeadsStatisticsByTeacher(
    startDate?: string,
    endDate?: string,
    teacher_id?: string,
  ) {
    const sequelize = this.trialLessonModel.sequelize;
    const trialWhere: any = {};
    const leadIncludeWhere: any = {};

    if (startDate || endDate) {
      trialWhere.createdAt = {};
      if (startDate) trialWhere.createdAt[Op.gte] = new Date(startDate);
      if (endDate) trialWhere.createdAt[Op.lte] = new Date(endDate);
    }
    if (teacher_id) {
      trialWhere.teacher_id = teacher_id;
    }

    // Get all trial lessons with lead info grouped by teacher
    const allTrialLessons = await this.trialLessonModel.findAll({
      where: trialWhere,
      include: [
        {
          model: User,
          as: "teacherInfo",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Lead,
          as: "leadInfo",
          attributes: ["id", "first_name", "last_name", "status"],
        },
      ],
    });

    // Build per-teacher stats
    const teacherMap = new Map<
      string,
      {
        teacher_id: string;
        teacherName: string;
        totalAssigned: number;
        attended: number;
        notAttended: number;
        pending: number;
        becameStudent: number;
        lost: number;
        inProgress: number;
        conversionRate: number;
        leads: {
          lead_id: string;
          leadName: string;
          trialStatus: string;
          leadStatus: string;
        }[];
      }
    >();

    for (const lesson of allTrialLessons) {
      const tId = lesson.teacher_id;
      if (!teacherMap.has(tId)) {
        const teacherName = lesson.teacherInfo
          ? `${lesson.teacherInfo.first_name} ${lesson.teacherInfo.last_name}`
          : "Noma'lum";
        teacherMap.set(tId, {
          teacher_id: tId,
          teacherName,
          totalAssigned: 0,
          attended: 0,
          notAttended: 0,
          pending: 0,
          becameStudent: 0,
          lost: 0,
          inProgress: 0,
          conversionRate: 0,
          leads: [],
        });
      }

      const stats = teacherMap.get(tId)!;
      stats.totalAssigned++;

      // Trial lesson status
      if (lesson.status === "keldi") stats.attended++;
      else if (lesson.status === "kelmadi") stats.notAttended++;
      else if (lesson.status === "belgilangan") stats.pending++;

      // Lead conversion status
      const leadStatus = lesson.leadInfo?.status || "";
      if (leadStatus === "O'qishga yozildi") stats.becameStudent++;
      else if (leadStatus === "Yo'qotildi") stats.lost++;
      else stats.inProgress++;

      stats.leads.push({
        lead_id: lesson.lead_id,
        leadName: lesson.leadInfo
          ? `${lesson.leadInfo.first_name} ${lesson.leadInfo.last_name}`
          : "Noma'lum",
        trialStatus: lesson.status,
        leadStatus,
      });
    }

    // Calculate conversion rates
    const teachers = Array.from(teacherMap.values()).map((t) => ({
      ...t,
      conversionRate:
        t.totalAssigned > 0
          ? Math.round((t.becameStudent / t.totalAssigned) * 100)
          : 0,
    }));

    // Sort by total assigned desc
    teachers.sort((a, b) => b.totalAssigned - a.totalAssigned);

    // Summary totals
    const totalAssigned = teachers.reduce((s, t) => s + t.totalAssigned, 0);
    const totalBecameStudent = teachers.reduce((s, t) => s + t.becameStudent, 0);
    const totalLost = teachers.reduce((s, t) => s + t.lost, 0);
    const totalInProgress = teachers.reduce((s, t) => s + t.inProgress, 0);
    const totalAttended = teachers.reduce((s, t) => s + t.attended, 0);
    const totalNotAttended = teachers.reduce((s, t) => s + t.notAttended, 0);

    return {
      summary: {
        totalAssigned,
        totalAttended,
        totalNotAttended,
        totalBecameStudent,
        totalLost,
        totalInProgress,
        overallConversionRate:
          totalAssigned > 0
            ? Math.round((totalBecameStudent / totalAssigned) * 100)
            : 0,
      },
      teachers,
    };
  }

  /**
   * Send trial lesson reminder SMS to a student
   * @param lesson - The trial lesson record
   */
  private async sendTrialLessonSms(lesson: LeadTrialLesson): Promise<void> {
    try {
      if (!lesson.leadInfo) {
        this.logger.warn(`Lead info not found for trial lesson ${lesson.id}`);
        throw new BadRequestException("Lead information not found");
      }

      const lead = lesson.leadInfo;

      if (!lead.phone) {
        this.logger.warn(
          `Lead ${lead.first_name} ${lead.last_name} has no phone number`,
        );
        throw new BadRequestException("Lead does not have a phone number");
      }

      // Format time as HH:MM
      const formatTime = (date: Date): string => {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const lessonTime = formatTime(lesson.scheduledAt);

      // Sanitize phone number to keep only '+' and digits
      const sanitizedPhone = lead.phone.replace(/[^\d+]/g, '');

      // Build SMS message
      const message = `Assalomu alaykum, ${lead.first_name} ${lead.last_name}! Bugun soat ${lessonTime} da sinov darsiga o'z vaqtida kelishni unutmang. Impulse Study LC`;

      // Send SMS
      await this.smsService.sendSms({
        mobile_phone: sanitizedPhone,
        message: message,
      });

      this.logger.log(
        `Trial lesson SMS sent successfully to ${lead.first_name} ${lead.last_name} (${sanitizedPhone}) for lesson at ${lessonTime}`,
      );
    } catch (error) {
      // Re-throw to be caught by the caller's catch block
      throw error;
    }
  }
}
