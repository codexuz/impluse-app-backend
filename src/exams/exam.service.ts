import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Exam } from "./entities/exam.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { CreateExamDto } from "./dto/create-exam.dto.js";
import { UpdateExamDto } from "./dto/update-exam.dto.js";

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam)
    private examModel: typeof Exam,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(Group)
    private groupModel: typeof Group
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    return this.examModel.create({ ...createExamDto });
  }

  async findAll(): Promise<Exam[]> {
    return this.examModel.findAll();
  }

  async findOne(id: string): Promise<Exam> {
    return this.examModel.findByPk(id);
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

  async findByLevel(level: string): Promise<Exam[]> {
    return this.examModel.findAll({
      where: { level },
      order: [["scheduled_at", "DESC"]],
    });
  }

  async getByUserId(userId: string): Promise<Exam[]> {
    // First, find all groups the user is a member of
    const userGroups = await this.groupStudentModel.findAll({
      where: {
        student_id: userId,
        status: "active", // Only include active memberships
      },
      attributes: ["group_id"],
    });

    if (!userGroups.length) {
      return []; // Return empty array if user is not in any group
    }

    // Extract group IDs
    const groupIds = userGroups.map((ug) => ug.group_id);

    // Find all exams for these groups
    return this.examModel.findAll({
      where: {
        group_id: groupIds,
      },
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
