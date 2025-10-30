import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateGroupStudentDto } from "./dto/create-group-student.dto.js";
import { UpdateGroupStudentDto } from "./dto/update-group-student.dto.js";
import { GroupStudent } from "./entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(Group)
    private groupModel: typeof Group
  ) {}

  async create(createDto: CreateGroupStudentDto): Promise<GroupStudent> {
    // Check if student is already in this specific group
    const existingInSameGroup = await this.groupStudentModel.findOne({
      where: {
        group_id: createDto.group_id,
        student_id: createDto.student_id,
        status: ["active", "frozen"], // Consider both active and frozen as existing
      },
    });

    if (existingInSameGroup) {
      throw new ConflictException(
        `Student is already enrolled in this group with status: ${existingInSameGroup.status}`
      );
    }

    return await this.groupStudentModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string): Promise<GroupStudent> {
    const groupStudent = await this.groupStudentModel.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });

    if (!groupStudent) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return groupStudent;
  }

  async findByGroupId(groupId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findByStudentId(studentId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async findActiveByGroupId(groupId: string): Promise<GroupStudent[]> {
    return await this.groupStudentModel.findAll({
      where: {
        group_id: groupId,
        status: "active",
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }

  async update(
    id: string,
    updateDto: UpdateGroupStudentDto
  ): Promise<GroupStudent> {
    const [affectedCount] = await this.groupStudentModel.update(updateDto, {
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const result = await this.groupStudentModel.destroy({
      where: { id },
    });

    if (result === 0) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return { id, deleted: true };
  }

  async updateStatus(id: string, status: string): Promise<GroupStudent> {
    const [affectedCount] = await this.groupStudentModel.update(
      { status },
      { where: { id } }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Group student with ID ${id} not found`);
    }

    return await this.findOne(id);
  }

  async transferStudent(
    studentId: string,
    fromGroupId: string,
    toGroupId: string
  ): Promise<{ removed: GroupStudent; added: GroupStudent }> {
    // Find existing enrollment in the source group
    const existingEnrollment = await this.groupStudentModel.findOne({
      where: {
        student_id: studentId,
        group_id: fromGroupId,
        status: "active",
      },
    });

    if (!existingEnrollment) {
      throw new NotFoundException(
        `Student is not actively enrolled in the source group (ID: ${fromGroupId})`
      );
    }

    // Check if student is already in the target group
    const existingInTargetGroup = await this.groupStudentModel.findOne({
      where: {
        group_id: toGroupId,
        student_id: studentId,
        status: ["active", "frozen"],
      },
    });

    if (existingInTargetGroup) {
      throw new ConflictException(
        `Student is already enrolled in the target group with status: ${existingInTargetGroup.status}`
      );
    }

    // Remove from current group (set status to 'removed')
    await existingEnrollment.update({ status: "removed" });

    // Add to new group
    const newEnrollment = await this.groupStudentModel.create({
      group_id: toGroupId,
      student_id: studentId,
      enrolled_at: new Date(),
      status: "active",
    });

    return {
      removed: existingEnrollment,
      added: await this.findOne(newEnrollment.id),
    };
  }

  async countStudentsByTeacher(teacherId: string): Promise<number> {
    // First get all groups for this teacher
    const teacherGroups = await this.groupModel.findAll({
      where: { teacher_id: teacherId },
      attributes: ["id"],
    });

    if (teacherGroups.length === 0) {
      return 0;
    }

    // Extract group IDs
    const groupIds = teacherGroups.map((group) => group.id);

    // Count distinct students across all teacher's groups
    const studentCount = await this.groupStudentModel.count({
      where: {
        group_id: groupIds,
        status: "active", // Only count active students
      },
      distinct: true,
      col: "student_id", // Count distinct students (in case a student is in multiple groups)
    });

    return studentCount;
  }

  async getStudentsByTeacher(teacherId: string): Promise<GroupStudent[]> {
    // Get all groups for this teacher
    const teacherGroups = await this.groupModel.findAll({
      where: { teacher_id: teacherId },
      attributes: ["id"],
    });

    if (teacherGroups.length === 0) {
      return [];
    }

    // Extract group IDs
    const groupIds = teacherGroups.map((group) => group.id);

    // Get all group students for this teacher's groups
    return await this.groupStudentModel.findAll({
      where: {
        group_id: groupIds,
        status: "active", // Only active students
      },
      include: [
        {
          model: User,
          as: "student",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
            "phone",
          ],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name", "level_id"],
          include: [
            {
              model: User,
              as: "teacher",
              attributes: [
                "user_id",
                "username",
                "first_name",
                "last_name",
                "avatar_url",
              ],
            },
          ],
        },
      ],
    });
  }
}

