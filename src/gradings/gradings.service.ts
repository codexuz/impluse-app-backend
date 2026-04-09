import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Grading } from "./entities/grading.entity.js";
import { CreateGradingDto } from "./dto/create-grading.dto.js";
import { UpdateGradingDto } from "./dto/update-grading.dto.js";
import { User } from "../users/entities/user.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { TelegramBotService } from "../telegram-bot/telegram-bot.service.js";
import { Op } from "sequelize";

@Injectable()
export class GradingsService {
  constructor(
    @InjectModel(Grading)
    private gradingModel: typeof Grading,
    private telegramBotService: TelegramBotService,
  ) {}

  async create(createGradingDto: CreateGradingDto): Promise<Grading> {
    const { student_id, teacher_id, group_id } = createGradingDto;
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingGrading = await this.gradingModel.findOne({
      where: {
        student_id,
        teacher_id,
        group_id,
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    if (existingGrading) {
      throw new ConflictException(
        `User has already been graded for this group and teacher today`
      );
    }

    return this.gradingModel.create(createGradingDto as any).then((grading) => {
      // Send Telegram notification to parent (non-blocking)
      this.telegramBotService
        .notifyGrading(
          createGradingDto.student_id,
          createGradingDto.grade,
          createGradingDto.percent,
          undefined,
          createGradingDto.lesson_name,
          createGradingDto.note,
        )
        .catch((e) => console.error("Telegram grading notification failed:", e));
      return grading;
    });
  }

  async findAll(
    studentId?: string,
    teacherId?: string,
    groupId?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Grading[]; total: number; page: number; limit: number; totalPages: number }> {
    const whereClause: any = {};
    if (studentId) whereClause.student_id = studentId;
    if (teacherId) whereClause.teacher_id = teacherId;
    if (groupId) whereClause.group_id = groupId;

    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.gradingModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByStudentId(
    studentId: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Grading[]; total: number; page: number; limit: number; totalPages: number }> {
    const whereClause: any = { student_id: studentId };
    
    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereClause.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.gradingModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Grading> {
    const grading = await this.gradingModel.findByPk(id, {
      include: [
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "username"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!grading) {
      throw new NotFoundException(`Grading with ID ${id} not found`);
    }

    return grading;
  }

  async update(
    id: string,
    updateGradingDto: UpdateGradingDto
  ): Promise<Grading> {
    const grading = await this.findOne(id);

    await grading.update(updateGradingDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const grading = await this.findOne(id);
    await grading.destroy();
  }
}
