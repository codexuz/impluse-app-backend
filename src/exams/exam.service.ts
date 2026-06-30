import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, WhereOptions } from "sequelize";
import { Exam } from "./entities/exam.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { CreateExamDto } from "./dto/create-exam.dto.js";
import { UpdateExamDto } from "./dto/update-exam.dto.js";
import { QueryExamDto } from "./dto/query-exam.dto.js";
import { ExamResult } from "./entities/exam_result.entity.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { Course } from "../courses/entities/course.entity.js";

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam)
    private examModel: typeof Exam,
    @InjectModel(ExamResult)
    private examResultModel: typeof ExamResult,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(Unit)
    private unitModel: typeof Unit,
    @InjectModel(Course)
    private courseModel: typeof Course,
    @InjectModel(User)
    private userModel: typeof User,
    private notificationsService: NotificationsService
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    // Derive the level (course) from the group rather than accepting it directly.
    const group = await this.groupModel.findByPk(createExamDto.group_id, {
      attributes: ["level_id"],
    });

    const exam = await this.examModel.create({
      ...createExamDto,
      level_id: group?.level_id ?? null,
    });

    // Send notifications to students in the group
    try {
      // Get all students in the group
      const groupStudents = await this.groupStudentModel.findAll({
        where: {
          group_id: createExamDto.group_id,
          status: "active",
        },
        include: [
          {
            model: User,
            as: "student",
            attributes: ["user_id", "first_name", "last_name"],
          },
        ],
      });

      if (groupStudents.length > 0) {
        const studentIds = groupStudents.map((gs) => gs.student_id);

        // Get notification tokens for these students
        const notificationTokens = await NotificationToken.findAll({
          where: {
            user_id: studentIds,
          },
        });

        if (notificationTokens.length > 0) {
          const tokens = notificationTokens.map((nt) => nt.token);
          const scheduledDate = new Date(
            exam.scheduled_at
          ).toLocaleDateString();

          // Send push notifications
          await this.notificationsService.notifyMultipleUsers(
            tokens,
            "New Exam Scheduled",
            `A new exam "${exam.title}" has been scheduled for ${scheduledDate}`,
            {
              exam_id: exam.id,
              group_id: exam.group_id,
              type: "exam_created",
            }
          );
        }
      }
    } catch (error) {
      console.error("Error sending exam notifications:", error);
      // Continue even if notification fails
    }

    return exam;
  }

  async findAll(query: QueryExamDto) {
    const { page = 1, limit = 10, status, group_id, teacher_id, start_date, end_date, bonusOrPenaltyAdded } = query;
    const where: WhereOptions = {};

    if (status) {
      where['status'] = status;
    }

    if (group_id) {
      where['group_id'] = group_id;
    }

    if (teacher_id) {
      const teacherGroups = await this.groupModel.findAll({
        where: { teacher_id },
        attributes: ['id'],
      });
      const groupIds = teacherGroups.map((g) => g.id);
      where['group_id'] = { [Op.in]: groupIds };
    }

    if (start_date || end_date) {
      const dateFilter: any = {};
      if (start_date) dateFilter[Op.gte] = new Date(start_date);
      if (end_date) dateFilter[Op.lte] = new Date(end_date);
      where['scheduled_at'] = dateFilter;
    }

    if (bonusOrPenaltyAdded !== undefined) {
      where['bonusOrPenaltyAdded'] = bonusOrPenaltyAdded;
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.examModel.findAndCountAll({
      where,
      order: [['scheduled_at', 'DESC']],
      limit,
      offset,
    });

    await this.resolveTeacherIds(rows);
    const data = await this.attachRelations(rows);

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  /**
   * Enrich exams with their related group, teacher, unit and level (course)
   * objects. The exam table only stores ids, so we batch-fetch each related
   * model and attach the full record (or null) to every exam.
   */
  private async attachRelations(exams: Exam[]): Promise<any[]> {
    if (exams.length === 0) return [];

    const groupIds = [...new Set(exams.map((e) => e.group_id).filter(Boolean))];
    const teacherIds = [
      ...new Set(exams.map((e) => e.teacher_id).filter(Boolean)),
    ];
    const unitIds = [...new Set(exams.map((e) => e.unit_id).filter(Boolean))];
    const levelIds = [...new Set(exams.map((e) => e.level_id).filter(Boolean))];

    const [groups, teachers, units, levels] = await Promise.all([
      groupIds.length
        ? this.groupModel.findAll({ where: { id: { [Op.in]: groupIds } } })
        : Promise.resolve([]),
      teacherIds.length
        ? this.userModel.findAll({
            where: { user_id: { [Op.in]: teacherIds } },
            attributes: ["user_id", "first_name", "last_name", "phone"],
          })
        : Promise.resolve([]),
      unitIds.length
        ? this.unitModel.findAll({ where: { id: { [Op.in]: unitIds } } })
        : Promise.resolve([]),
      levelIds.length
        ? this.courseModel.findAll({ where: { id: { [Op.in]: levelIds } } })
        : Promise.resolve([]),
    ]);

    const groupMap = new Map(groups.map((g: any) => [g.id, g]));
    const teacherMap = new Map(teachers.map((t: any) => [t.user_id, t]));
    const unitMap = new Map(units.map((u: any) => [u.id, u]));
    const levelMap = new Map(levels.map((l: any) => [l.id, l]));

    return exams.map((exam) => ({
      ...exam.toJSON(),
      group: groupMap.get(exam.group_id) ?? null,
      teacher: exam.teacher_id ? (teacherMap.get(exam.teacher_id) ?? null) : null,
      unit: exam.unit_id ? (unitMap.get(exam.unit_id) ?? null) : null,
      // `level` is an existing string column on the exam; the related course
      // record is exposed separately as `level_data`.
      level_data: exam.level_id ? (levelMap.get(exam.level_id) ?? null) : null,
    }));
  }

  async findOne(id: string): Promise<any> {
    const exam = await this.examModel.findByPk(id);
    if (!exam) return exam;

    if (!exam.teacher_id) {
      const group = await this.groupModel.findOne({
        where: { id: exam.group_id },
        attributes: ['teacher_id'],
      });
      if (group?.teacher_id) {
        exam.setDataValue('teacher_id', group.teacher_id);
      }
    }

    const [enriched] = await this.attachRelations([exam]);
    return enriched;
  }

  private async resolveTeacherIds(exams: Exam[]): Promise<void> {
    const missing = exams.filter((e) => !e.teacher_id);
    if (missing.length === 0) return;

    const groupIds = [...new Set(missing.map((e) => e.group_id))];
    const groups = await this.groupModel.findAll({
      where: { id: { [Op.in]: groupIds } },
      attributes: ['id', 'teacher_id'],
    });
    const groupTeacherMap = new Map(groups.map((g) => [g.id, g.teacher_id]));

    for (const exam of missing) {
      const tid = groupTeacherMap.get(exam.group_id);
      if (tid) exam.setDataValue('teacher_id', tid);
    }
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<[number]> {
    return this.examModel.update(updateExamDto, {
      where: { id },
    });
  }

  async remove(id: string): Promise<number> {
    return this.examModel.destroy({
      where: { id },
    });
  }

  async findByGroup(groupId: string): Promise<Exam[]> {
    return this.examModel.findAll({
      where: { group_id: groupId },
      order: [["scheduled_at", "DESC"]],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Exam[]> {
    return this.examModel.findAll({
      where: {
        scheduled_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [["scheduled_at", "ASC"]],
    });
  }

  async findByStatus(status: string): Promise<Exam[]> {
    return this.examModel.findAll({
      where: { status },
      order: [["scheduled_at", "DESC"]],
    });
  }

  async getByUserId(userId: string): Promise<Exam[]> {
    const results = await this.examResultModel.findAll({
      where: { student_id: userId },
      attributes: ["exam_id"],
    });

    if (!results.length) return [];

    const examIds = results.map((r) => r.exam_id);

    return this.examModel.findAll({
      where: { id: examIds },
      order: [["scheduled_at", "DESC"]],
    });
  }

  async getByTeacherId(teacherId: string): Promise<Exam[]> {
    // First, find all groups where the user is the teacher
    const teacherGroups = await this.groupModel.findAll({
      where: {
        teacher_id: teacherId,
      },
      attributes: ["id"],
    });

    if (!teacherGroups.length) {
      return []; // Return empty array if teacher has no groups
    }

    // Extract group IDs
    const groupIds = teacherGroups.map((tg) => tg.id);

    // Find all exams for these groups
    return this.examModel.findAll({
      where: {
        group_id: groupIds,
      },
      order: [["scheduled_at", "DESC"]],
    });
  }
}
