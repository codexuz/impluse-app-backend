import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateSupportAssignmentDto,
  UpdateSupportAssignmentDto,
} from "./dto/index.js";
import { SupportAssignment } from "./entities/support-assignment.entity.js";

const baseInclude = [
  {
    association: "teacher",
    attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
  },
  {
    association: "main_teacher",
    attributes: ["user_id", "username", "first_name", "last_name", "avatar_url"],
  },
  { association: "group" },
];

@Injectable()
export class SupportAssignmentsService {
  constructor(
    @InjectModel(SupportAssignment)
    private supportAssignmentModel: typeof SupportAssignment,
  ) {}

  async create(
    dto: CreateSupportAssignmentDto,
  ): Promise<SupportAssignment> {
    try {
      const assignment = await this.supportAssignmentModel.create({ ...dto });
      return this.findOne(assignment.id);
    } catch (error:any) {
      throw new BadRequestException(
        `Failed to create support assignment: ${error.message}`,
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      support_teacher_id?: string;
      teacher_id?: string;
      group_id?: string;
      days?: string;
    },
  ): Promise<{
    data: SupportAssignment[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (filters?.support_teacher_id)
      where.support_teacher_id = filters.support_teacher_id;
    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.group_id) where.group_id = filters.group_id;
    if (filters?.days) where.days = filters.days;

    const { count, rows } = await this.supportAssignmentModel.findAndCountAll({
      where,
      include: baseInclude,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string): Promise<SupportAssignment> {
    const assignment = await this.supportAssignmentModel.findByPk(id, {
      include: baseInclude,
    });
    if (!assignment) {
      throw new NotFoundException(`Support assignment with ID ${id} not found`);
    }
    return assignment;
  }

  async findByTeacher(teacherId: string): Promise<SupportAssignment[]> {
    return this.supportAssignmentModel.findAll({
      where: { support_teacher_id: teacherId },
      include: baseInclude,
      order: [["createdAt", "DESC"]],
    });
  }

  async findByMainTeacher(teacherId: string): Promise<SupportAssignment[]> {
    return this.supportAssignmentModel.findAll({
      where: { teacher_id: teacherId },
      include: baseInclude,
      order: [["createdAt", "DESC"]],
    });
  }

  async findByGroup(groupId: string): Promise<SupportAssignment[]> {
    return this.supportAssignmentModel.findAll({
      where: { group_id: groupId },
      include: baseInclude,
      order: [["createdAt", "DESC"]],
    });
  }

  async update(
    id: string,
    dto: UpdateSupportAssignmentDto,
  ): Promise<SupportAssignment> {
    const assignment = await this.findOne(id);
    try {
      await assignment.update(dto);
      return this.findOne(id);
    } catch (error:any) {
      throw new BadRequestException(
        `Failed to update support assignment: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
    return { message: "Support assignment deleted successfully" };
  }
}
