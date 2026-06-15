import { Injectable, NotFoundException, Logger, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateLeadTrialLessonDto } from "./dto/create-lead-trial-lesson.dto.js";
import { UpdateLeadTrialLessonDto } from "./dto/update-lead-trial-lesson.dto.js";
import { LeadTrialLesson } from "./entities/lead-trial-lesson.entity.js";
import {
  LeadAssignment,
  LeadAssignmentOutcome,
} from "./entities/lead-assignment.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Lead } from "../leads/entities/lead.entity.js";
import { Course } from "../courses/entities/course.entity.js";
import { Op } from "sequelize";
import { SmsService } from "../sms/sms.service.js";

@Injectable()
export class LeadTrialLessonsService {
  private readonly logger = new Logger(LeadTrialLessonsService.name);

  constructor(
    @InjectModel(LeadTrialLesson)
    private trialLessonModel: typeof LeadTrialLesson,
    @InjectModel(LeadAssignment)
    private leadAssignmentModel: typeof LeadAssignment,
    @InjectModel(Lead)
    private leadModel: typeof Lead,
    @InjectModel(Course)
    private courseModel: typeof Course,
    private readonly smsService: SmsService,
  ) {}

  /** Lead statuses that count as a conversion / loss, regardless of teacher. */
  private static readonly ENROLLED_STATUS = "O'qishga yozildi";
  private static readonly LOST_STATUS = "Yo'qotildi";

  /**
   * Derive the conversion outcome (independent of attendance) of a
   * (teacher, lead) assignment from the lead's current global status.
   */
  private deriveOutcome(leadStatus: string | undefined): LeadAssignmentOutcome {
    if (leadStatus === LeadTrialLessonsService.ENROLLED_STATUS)
      return LeadAssignmentOutcome.BECAME_STUDENT;
    if (leadStatus === LeadTrialLessonsService.LOST_STATUS)
      return LeadAssignmentOutcome.LOST;
    return LeadAssignmentOutcome.PENDING;
  }

  /** A lead attended if it showed up ("keldi") to any of the teacher's trials. */
  private deriveAttended(trialStatuses: string[]): boolean {
    return trialStatuses.includes("keldi");
  }

  /**
   * Rebuild the `lead_assignments` table from `lead_trial_lessons`, collapsing
   * each lead's multiple trial lessons per teacher into a single assignment row
   * with a derived outcome. Idempotent: upserts one row per (teacher, lead).
   *
   * This is the backfill/refresh used to keep assignment-based stats in sync with
   * the trial-lesson workflow that already exists.
   */
  async syncAssignmentsFromTrials(): Promise<{ synced: number }> {
    const trials = await this.trialLessonModel.findAll({
      include: [
        {
          model: Lead,
          as: "leadInfo",
          attributes: ["id", "status", "branch_id"],
          required: false,
          paranoid: false,
        },
      ],
      order: [["scheduledAt", "ASC"]],
    });

    // Group trials by teacher+lead.
    const groups = new Map<
      string,
      {
        teacher_id: string;
        lead_id: string;
        branch_id: string | null;
        leadStatus: string | undefined;
        firstScheduledAt: Date;
        trialStatuses: string[];
      }
    >();

    for (const t of trials) {
      if (!t.teacher_id || !t.lead_id) continue;
      const key = `${t.teacher_id}::${t.lead_id}`;
      const existing = groups.get(key);
      if (existing) {
        existing.trialStatuses.push(t.status);
        if (t.scheduledAt && t.scheduledAt < existing.firstScheduledAt)
          existing.firstScheduledAt = t.scheduledAt;
      } else {
        groups.set(key, {
          teacher_id: t.teacher_id,
          lead_id: t.lead_id,
          branch_id: (t.leadInfo as any)?.branch_id ?? null,
          leadStatus: (t.leadInfo as any)?.status,
          firstScheduledAt: t.scheduledAt ?? new Date(),
          trialStatuses: [t.status],
        });
      }
    }

    let synced = 0;
    for (const g of groups.values()) {
      await this.leadAssignmentModel.upsert({
        teacher_id: g.teacher_id,
        lead_id: g.lead_id,
        branch_id: g.branch_id,
        outcome: this.deriveOutcome(g.leadStatus),
        attended: this.deriveAttended(g.trialStatuses),
        assigned_at: g.firstScheduledAt,
      });
      synced++;
    }

    return { synced };
  }

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
        attributes: ["id", "first_name", "last_name", "phone", "status", "course_ids"],
        required: false,
        include: [
          {
            model: User,
            as: "admin",
            attributes: ["user_id", "first_name", "last_name", "username", "phone"],
            required: false,
          },
        ],
      },
    ];
  }

  private async enrichWithCourseNames(lessons: LeadTrialLesson[]): Promise<void> {
    const allCourseIds = [
      ...new Set(
        lessons.flatMap((l) => l.leadInfo?.course_ids ?? []).filter(Boolean),
      ),
    ];
    if (!allCourseIds.length) return;

    const courses = await this.courseModel.findAll({
      where: { id: allCourseIds },
      attributes: ["id", "title"],
    });
    const courseMap = new Map(courses.map((c) => [c.id, c.title]));

    for (const lesson of lessons) {
      if (lesson.leadInfo) {
        const courseNames = (lesson.leadInfo.course_ids ?? []).map((id) => ({
          id,
          title: courseMap.get(id) ?? id,
        }));
        lesson.leadInfo.setDataValue("courseNames", courseNames);
      }
    }
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
    await this.enrichWithCourseNames(rows);

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
    await this.enrichWithCourseNames([trialLesson]);
    return trialLesson;
  }

  async findByStatus(status: string): Promise<LeadTrialLesson[]> {
    const results = await this.trialLessonModel.findAll({
      where: { status },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
    await this.enrichWithCourseNames(results);
    return results;
  }

  async findByTeacher(teacherId: string): Promise<LeadTrialLesson[]> {
    const results = await this.trialLessonModel.findAll({
      where: { teacher_id: teacherId },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
    await this.enrichWithCourseNames(results);
    return results;
  }

  async findByLead(leadId: string): Promise<LeadTrialLesson[]> {
    const results = await this.trialLessonModel.findAll({
      where: { lead_id: leadId },
      order: [["scheduledAt", "DESC"]],
      include: this.getIncludeOptions(),
    });
    await this.enrichWithCourseNames(results);
    return results;
  }

  async findUpcoming(limit = 20): Promise<LeadTrialLesson[]> {
    const results = await this.trialLessonModel.findAll({
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
    await this.enrichWithCourseNames(results);
    return results;
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



  /**
   * Per-teacher assigned-lead statistics, built from the deduplicated
   * `lead_assignments` table (one row per teacher+lead) so each lead is counted
   * exactly once per teacher — no double-counting across multiple trial lessons.
   *
   * The assignment table is refreshed from trials before reading, so the numbers
   * always reflect the latest trial/lead state without a separate cron.
   *
   * The response shape is backward-compatible with the previous trial-based
   * version (totalAssigned / attended / notAttended / pending / becameStudent /
   * lost / inProgress / conversionRate / leads[]).
   */
  async getLeadsStatisticsByTeacher(
    startDate?: string,
    endDate?: string,
    teacher_id?: string,
  ) {
    // Keep assignments in sync with the trial-lesson workflow.
    await this.syncAssignmentsFromTrials();

    const where: any = {};
    if (startDate || endDate) {
      where.assigned_at = {};
      if (startDate) where.assigned_at[Op.gte] = new Date(startDate);
      if (endDate) where.assigned_at[Op.lte] = new Date(endDate);
    }
    if (teacher_id) {
      where.teacher_id = teacher_id;
    }

    const assignments = await this.leadAssignmentModel.findAll({
      where,
      include: [
        {
          model: User,
          as: "teacherInfo",
          attributes: ["user_id", "first_name", "last_name", "username"],
          required: false,
        },
        {
          model: Lead,
          as: "leadInfo",
          attributes: ["id", "first_name", "last_name", "status"],
          required: false,
          paranoid: false,
        },
      ],
    });

    // Focus on ATTENDED leads that reached a final outcome (enrolled or lost) —
    // pending leads are excluded. Per teacher: how many converted, how many were
    // lost, and the conversion rate (converted / decided).
    type TeacherStat = {
      teacher_id: string;
      teacherName: string;
      attended: number; // decided attended leads (became_student + lost)
      becameStudent: number; // attended leads that enrolled
      lost: number; // attended leads that were lost
      conversionRate: number; // becameStudent / attended, 0-100
      leads: {
        lead_id: string;
        leadName: string;
        outcome: LeadAssignmentOutcome;
        leadStatus: string;
      }[];
    };

    const teacherMap = new Map<string, TeacherStat>();

    for (const a of assignments) {
      // Only attended leads with a final outcome (no pending).
      if (!a.attended) continue;
      const isConverted = a.outcome === LeadAssignmentOutcome.BECAME_STUDENT;
      const isLost = a.outcome === LeadAssignmentOutcome.LOST;
      if (!isConverted && !isLost) continue;

      const tId = a.teacher_id;
      if (!teacherMap.has(tId)) {
        const info = (a as any).teacherInfo;
        const teacherName = info
          ? `${info.first_name ?? ""} ${info.last_name ?? ""}`.trim() ||
            info.username ||
            "Noma'lum"
          : "Noma'lum";
        teacherMap.set(tId, {
          teacher_id: tId,
          teacherName,
          attended: 0,
          becameStudent: 0,
          lost: 0,
          conversionRate: 0,
          leads: [],
        });
      }

      const stats = teacherMap.get(tId)!;
      stats.attended++;
      if (isConverted) stats.becameStudent++;
      else stats.lost++;

      const leadInfo = (a as any).leadInfo;
      stats.leads.push({
        lead_id: a.lead_id,
        leadName: leadInfo
          ? `${leadInfo.first_name ?? ""} ${leadInfo.last_name ?? ""}`.trim() ||
            "Noma'lum"
          : "Noma'lum",
        outcome: a.outcome,
        leadStatus: leadInfo?.status ?? "",
      });
    }

    const teachers = Array.from(teacherMap.values()).map((t) => ({
      ...t,
      // Conversion rate among decided attended leads.
      conversionRate:
        t.attended > 0
          ? Math.round((t.becameStudent / t.attended) * 100)
          : 0,
    }));

    // Best converters first.
    teachers.sort(
      (a, b) => b.conversionRate - a.conversionRate || b.attended - a.attended,
    );

    // Summary totals
    const sum = (key: keyof TeacherStat) =>
      teachers.reduce((s, t) => s + (t[key] as number), 0);
    const totalAttended = sum("attended");
    const totalBecameStudent = sum("becameStudent");

    return {
      summary: {
        totalAttended,
        totalBecameStudent,
        totalLost: sum("lost"),
        // Overall conversion rate among decided attended leads.
        overallConversionRate:
          totalAttended > 0
            ? Math.round((totalBecameStudent / totalAttended) * 100)
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
