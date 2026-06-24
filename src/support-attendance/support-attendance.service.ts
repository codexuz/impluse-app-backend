import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { SupportAttendance } from "./entities/support-attendance.entity.js";
import {
  CreateSupportAttendanceDto,
  UpdateSupportAttendanceDto,
  BulkSupportAttendanceDto,
} from "./dto/index.js";

const studentInclude = {
  association: "student",
  attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
};
const teacherInclude = {
  association: "teacher",
  attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
};
const baseInclude = [studentInclude, teacherInclude, { association: "group" }];

@Injectable()
export class SupportAttendanceService {
  constructor(
    @InjectModel(SupportAttendance)
    private supportAttendanceModel: typeof SupportAttendance,
  ) {}

  async create(dto: CreateSupportAttendanceDto): Promise<SupportAttendance> {
    const existing = await this.supportAttendanceModel.findOne({
      where: {
        group_id: dto.group_id,
        student_id: dto.student_id,
        date: dto.date,
      },
    });

    if (existing) {
      throw new ConflictException(
        "Support attendance already exists for this student, group, and date",
      );
    }

    const created = await this.supportAttendanceModel.create({
      ...dto,
      note: dto.note ?? "",
    } as any);
    return this.findOne(created.id);
  }

  /**
   * Mark a whole group for one session/date at once. Existing records for the
   * same (group, student, date) are updated instead of duplicated.
   */
  async markBulk(dto: BulkSupportAttendanceDto) {
    const created: SupportAttendance[] = [];
    const updated: SupportAttendance[] = [];

    for (const record of dto.records) {
      const existing = await this.supportAttendanceModel.findOne({
        where: {
          group_id: dto.group_id,
          student_id: record.student_id,
          date: dto.date,
        },
      });

      if (existing) {
        await existing.update({
          status: record.status,
          note: record.note ?? existing.note,
          support_teacher_id: dto.support_teacher_id,
          assignment_id: dto.assignment_id ?? existing.assignment_id,
        });
        updated.push(existing);
      } else {
        const row = await this.supportAttendanceModel.create({
          assignment_id: dto.assignment_id ?? null,
          support_teacher_id: dto.support_teacher_id,
          group_id: dto.group_id,
          student_id: record.student_id,
          status: record.status,
          note: record.note ?? "",
          date: dto.date,
        } as any);
        created.push(row);
      }
    }

    return {
      created: created.length,
      updated: updated.length,
      total: dto.records.length,
    };
  }

  async findAll(filters: {
    group_id?: string;
    student_id?: string;
    support_teacher_id?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SupportAttendance[]> {
    const where: any = {};
    if (filters.group_id) where.group_id = filters.group_id;
    if (filters.student_id) where.student_id = filters.student_id;
    if (filters.support_teacher_id)
      where.support_teacher_id = filters.support_teacher_id;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.date = { [Op.between]: [filters.startDate, filters.endDate] };
    }

    return this.supportAttendanceModel.findAll({
      where,
      include: baseInclude,
      order: [
        ["date", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  async findOne(id: string): Promise<SupportAttendance> {
    const record = await this.supportAttendanceModel.findByPk(id, {
      include: baseInclude,
    });
    if (!record) {
      throw new NotFoundException(
        `Support attendance with ID ${id} not found`,
      );
    }
    return record;
  }

  async findByGroup(groupId: string): Promise<SupportAttendance[]> {
    return this.findAll({ group_id: groupId });
  }

  async findByStudent(studentId: string): Promise<SupportAttendance[]> {
    return this.findAll({ student_id: studentId });
  }

  async findByTeacher(teacherId: string): Promise<SupportAttendance[]> {
    return this.findAll({ support_teacher_id: teacherId });
  }

  async update(
    id: string,
    dto: UpdateSupportAttendanceDto,
  ): Promise<SupportAttendance> {
    const record = await this.findOne(id);

    // Guard against creating a duplicate when moving student/group/date
    if (dto.student_id || dto.group_id || dto.date) {
      const conflict = await this.supportAttendanceModel.findOne({
        where: {
          id: { [Op.ne]: id },
          group_id: dto.group_id || record.group_id,
          student_id: dto.student_id || record.student_id,
          date: dto.date || record.date,
        },
      });
      if (conflict) {
        throw new ConflictException(
          "Support attendance already exists for this student, group, and date",
        );
      }
    }

    await record.update(dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const record = await this.findOne(id);
    await record.destroy();
    return { id, deleted: true };
  }

  async getStats(filters: {
    group_id?: string;
    student_id?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};
    if (filters.group_id) where.group_id = filters.group_id;
    if (filters.student_id) where.student_id = filters.student_id;
    if (filters.startDate && filters.endDate) {
      where.date = { [Op.between]: [filters.startDate, filters.endDate] };
    }

    const total = await this.supportAttendanceModel.count({ where });
    const present = await this.supportAttendanceModel.count({
      where: { ...where, status: "present" },
    });
    const absent = await this.supportAttendanceModel.count({
      where: { ...where, status: "absent" },
    });
    const late = await this.supportAttendanceModel.count({
      where: { ...where, status: "late" },
    });

    return {
      total,
      present,
      absent,
      late,
      attendanceRate:
        total > 0 ? (((present + late) / total) * 100).toFixed(2) : "0.00",
    };
  }
}
