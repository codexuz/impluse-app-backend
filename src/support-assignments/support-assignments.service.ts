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

  async findAll(filters?: {
    support_teacher_id?: string;
    group_id?: string;
    days?: string;
  }): Promise<SupportAssignment[]> {
    const where: any = {};
    if (filters?.support_teacher_id)
      where.support_teacher_id = filters.support_teacher_id;
    if (filters?.group_id) where.group_id = filters.group_id;
    if (filters?.days) where.days = filters.days;

    return this.supportAssignmentModel.findAll({
      where,
      include: baseInclude,
      order: [["createdAt", "DESC"]],
    });
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

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
  }
}
