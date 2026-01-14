import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { CreateCompensateLessonDto } from "./dto/create-compensate-lesson.dto.js";
import { UpdateCompensateLessonDto } from "./dto/update-compensate-lesson.dto.js";
import { CreateCompensateTeacherWalletDto } from "./dto/create-compensate-teacher-wallet.dto.js";
import { CompensateLesson } from "./entities/compensate-lesson.entity.js";
import { CompensateTeacherWallet } from "./entities/compensate-teacher-wallet.entity.js";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class CompensateLessonsService {
  constructor(
    @InjectModel(CompensateLesson)
    private compensateLessonModel: typeof CompensateLesson,
    @InjectModel(CompensateTeacherWallet)
    private compensateTeacherWalletModel: typeof CompensateTeacherWallet
  ) {}

  async create(createCompensateLessonDto: CreateCompensateLessonDto) {
    // Check if compensate lesson already exists for this attendance
    const existingCompensateLesson = await this.compensateLessonModel.findOne({
      where: {
        attendance_id: createCompensateLessonDto.attendance_id,
      },
    });

    if (existingCompensateLesson) {
      throw new ConflictException(
        "Compensate lesson already exists for this attendance record"
      );
    }

    const compensateLesson = await this.compensateLessonModel.create(
      createCompensateLessonDto as any
    );

    return compensateLesson;
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      teacher_id?: string;
      student_id?: string;
      compensated?: boolean;
    }
  ): Promise<{
    lessons: CompensateLesson[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.student_id) where.student_id = filters.student_id;
    if (filters?.compensated !== undefined)
      where.compensated = filters.compensated;

    const { count, rows } = await this.compensateLessonModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      lessons: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string) {
    const compensateLesson = await this.compensateLessonModel.findByPk(id);

    if (!compensateLesson) {
      throw new NotFoundException(`Compensate lesson with ID ${id} not found`);
    }

    return compensateLesson;
  }

  async update(
    id: string,
    updateCompensateLessonDto: UpdateCompensateLessonDto
  ) {
    const compensateLesson = await this.findOne(id);

    await compensateLesson.update(updateCompensateLessonDto as any);

    return compensateLesson;
  }

  async remove(id: string) {
    const compensateLesson = await this.findOne(id);

    await compensateLesson.destroy();

    return { message: `Compensate lesson with ID ${id} has been removed` };
  }

  // Compensate Teacher Wallet methods
  async createWalletEntry(
    createCompensateTeacherWalletDto: CreateCompensateTeacherWalletDto
  ) {
    const walletEntry = await this.compensateTeacherWalletModel.create(
      createCompensateTeacherWalletDto as any
    );

    return walletEntry;
  }

  async findAllWalletEntries(
    page = 1,
    limit = 10,
    filters?: {
      teacher_id?: string;
      compensate_lesson_id?: string;
    }
  ): Promise<{
    walletEntries: CompensateTeacherWallet[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters?.teacher_id) where.teacher_id = filters.teacher_id;
    if (filters?.compensate_lesson_id)
      where.compensate_lesson_id = filters.compensate_lesson_id;

    const { count, rows } =
      await this.compensateTeacherWalletModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

    return {
      walletEntries: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOneWalletEntry(id: string) {
    const walletEntry = await this.compensateTeacherWalletModel.findByPk(id);

    if (!walletEntry) {
      throw new NotFoundException(
        `Compensate teacher wallet entry with ID ${id} not found`
      );
    }

    return walletEntry;
  }

  async markAsPaid(id: string) {
    const walletEntry = await this.findOneWalletEntry(id);

    await walletEntry.update({ paid_at: new Date() } as any);

    return walletEntry;
  }
}
