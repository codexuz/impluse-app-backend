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
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Attendance } from "../attendance/entities/attendance.entity.js";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

@Injectable()
export class CompensateLessonsService {
  constructor(
    @InjectModel(CompensateLesson)
    private compensateLessonModel: typeof CompensateLesson,
    @InjectModel(CompensateTeacherWallet)
    private compensateTeacherWalletModel: typeof CompensateTeacherWallet,
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
        "Compensate lesson already exists for this attendance record",
      );
    }

    const compensateLesson = await this.compensateLessonModel.create(
      createCompensateLessonDto as any,
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
    },
  ): Promise<{
    data: CompensateLesson[];
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

    // Only return lessons where valid_until has not expired
    const today = new Date().toISOString().split("T")[0];
    where.valid_until = { [Op.gte]: today };

    const { count, rows } = await this.compensateLessonModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          as: "teacher",
          attributes: ["user_id", "first_name", "last_name", "phone"],
        },
        {
          model: User,
          as: "student",
          attributes: ["user_id", "first_name", "last_name", "phone"],
        },
        {
          model: Attendance,
          as: "attendance",
        },
      ],
    });

    return {
      data: rows,
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
    updateCompensateLessonDto: UpdateCompensateLessonDto,
  ) {
    const compensateLesson = await this.findOne(id);

    // Check if the lesson is being marked as compensated
    if (
      updateCompensateLessonDto.compensated === true &&
      !compensateLesson.compensated
    ) {
      // Check if valid_until has not expired
      const today = new Date().toISOString().split("T")[0];
      const validUntil = compensateLesson.valid_until;

      if (validUntil >= today) {
        // Get compensated_by from update or existing record
        const compensatedBy =
          updateCompensateLessonDto.compensated_by ||
          compensateLesson.compensated_by;

        // Only create wallet entry if compensated by main_teacher
        if (compensatedBy === "main_teacher") {
          try {
            // Get teacher profile to get payment amount
            const teacherProfile = await TeacherProfile.findOne({
              where: { user_id: compensateLesson.teacher_id },
            });

            if (teacherProfile && teacherProfile.payment_value) {
              // Create wallet entry for the teacher
              await this.compensateTeacherWalletModel.create({
                teacher_id: compensateLesson.teacher_id,
                compensate_lesson_id: compensateLesson.id,
                amount: teacherProfile.payment_value,
              } as any);

              console.log(
                `Compensate wallet entry created for teacher ${compensateLesson.teacher_id}, amount ${teacherProfile.payment_value}`,
              );
            }
          } catch (error) {
            console.error(
              `Error creating wallet entry for compensate lesson ${id}:`,
              error.message,
            );
            // Don't throw error - wallet creation failure shouldn't block update
          }
        } else if (compensatedBy === "support_teacher") {
          console.log(
            `Lesson ${id} compensated by support_teacher - no wallet entry created`,
          );
        }
      } else {
        console.warn(
          `Lesson ${id} valid_until has expired (${validUntil}) - no wallet entry created`,
        );
      }
    }

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
    createCompensateTeacherWalletDto: CreateCompensateTeacherWalletDto,
  ) {
    const walletEntry = await this.compensateTeacherWalletModel.create(
      createCompensateTeacherWalletDto as any,
    );

    return walletEntry;
  }

  async findAllWalletEntries(
    page = 1,
    limit = 10,
    filters?: {
      teacher_id?: string;
      compensate_lesson_id?: string;
    },
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

  async getTeacherWalletWithDateRange(
    teacherId: string,
    page = 1,
    limit = 10,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    walletEntries: CompensateTeacherWallet[];
    total: number;
    totalPages: number;
    currentPage: number;
    totalAmount: number;
  }> {
    const offset = (page - 1) * limit;
    const where: any = {
      teacher_id: teacherId,
    };

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      where.created_at = {
        [Op.gte]: startDate,
      };
    } else if (endDate) {
      where.created_at = {
        [Op.lte]: endDate,
      };
    }

    const { count, rows } =
      await this.compensateTeacherWalletModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

    // Calculate total amount
    const totalAmount = rows.reduce(
      (sum, entry) => sum + (Number(entry.amount) || 0),
      0,
    );

    return {
      walletEntries: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalAmount,
    };
  }

  async findOneWalletEntry(id: string) {
    const walletEntry = await this.compensateTeacherWalletModel.findByPk(id);

    if (!walletEntry) {
      throw new NotFoundException(
        `Compensate teacher wallet entry with ID ${id} not found`,
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
