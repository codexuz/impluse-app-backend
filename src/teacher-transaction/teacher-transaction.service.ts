import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateTeacherTransactionDto } from "./dto/create-teacher-transaction.dto.js";
import { UpdateTeacherTransactionDto } from "./dto/update-teacher-transaction.dto.js";
import { QueryTeacherTransactionDto } from "./dto/query-teacher-transaction.dto.js";
import { TeacherTransaction } from "./entities/teacher-transaction.entity.js";
import { TeacherWalletService } from "../teacher-wallet/teacher-wallet.service.js";
import { User } from "../users/entities/user.entity.js";
import { Op } from "sequelize";

@Injectable()
export class TeacherTransactionService {
  constructor(
    @InjectModel(TeacherTransaction)
    private teacherTransactionModel: typeof TeacherTransaction,
    private teacherWalletService: TeacherWalletService,
  ) {}

  async create(
    createTeacherTransactionDto: CreateTeacherTransactionDto,
  ): Promise<TeacherTransaction> {
    return await this.teacherTransactionModel.create(
      createTeacherTransactionDto as any,
    );
  }

  async findAll(queryDto: QueryTeacherTransactionDto): Promise<{
    data: TeacherTransaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    totalAmount: number;
  }> {
    const {
      page = 1,
      limit = 10,
      type,
      teacher_id,
      student_id,
      branch_id,
      search,
      start_date,
      end_date,
    } = queryDto;

    const whereCondition: any = {};

    // Apply filters
    if (type) {
      whereCondition.type = type;
    }

    if (teacher_id) {
      whereCondition.teacher_id = teacher_id;
    }

    if (student_id) {
      whereCondition.student_id = student_id;
    }

    if (branch_id) {
      whereCondition.branch_id = branch_id;
    }

    // Date range filter
    if (start_date || end_date) {
      whereCondition.created_at = {};
      if (start_date) {
        whereCondition.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        whereCondition.created_at[Op.lte] = new Date(end_date);
      }
    }

    // Search filter (search in teacher and student names)
    const include: any[] = [
      {
        model: User,
        as: "teacher",
        attributes: ["user_id", "username", "first_name", "last_name", "phone"],
        required: false,
      },
      {
        model: User,
        as: "student",
        attributes: ["user_id", "username", "first_name", "last_name", "phone"],
        required: false,
      },
    ];

    if (search) {
      whereCondition[Op.or] = [
        { "$teacher.first_name$": { [Op.iLike]: `%${search}%` } },
        { "$teacher.last_name$": { [Op.iLike]: `%${search}%` } },
        { "$teacher.username$": { [Op.iLike]: `%${search}%` } },
        { "$student.first_name$": { [Op.iLike]: `%${search}%` } },
        { "$student.last_name$": { [Op.iLike]: `%${search}%` } },
        { "$student.username$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    // Get total count
    const total = await this.teacherTransactionModel.count({
      where: whereCondition,
      include,
      distinct: true,
    });

    // Calculate total amount for filtered transactions
    const allFilteredTransactions = await this.teacherTransactionModel.findAll({
      where: whereCondition,
      include,
      attributes: ["amount"],
    });

    const totalAmount = allFilteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    // Get paginated data
    const data = await this.teacherTransactionModel.findAll({
      where: whereCondition,
      include,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      totalAmount,
    };
  }

  async findByTeacherId(
    teacherId: string,
    type?: string,
  ): Promise<TeacherTransaction[]> {
    const whereCondition: any = { teacher_id: teacherId };

    if (type) {
      whereCondition.type = type;
    }

    const transactions = await this.teacherTransactionModel.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        `No transactions found for teacher with ID "${teacherId}"`,
      );
    }

    return transactions;
  }

  async findOne(id: string): Promise<TeacherTransaction> {
    const transaction = await this.teacherTransactionModel.findByPk(id);

    if (!transaction) {
      throw new NotFoundException(
        `Teacher transaction with ID "${id}" not found`,
      );
    }

    return transaction;
  }

  async update(
    id: string,
    updateTeacherTransactionDto: UpdateTeacherTransactionDto,
  ): Promise<TeacherTransaction> {
    const transaction = await this.findOne(id);

    await transaction.update(updateTeacherTransactionDto as any);

    return transaction;
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);

    // Deduct the transaction amount from teacher's wallet
    const wallet = await this.teacherWalletService.findByTeacherId(
      transaction.teacher_id,
    );
    await this.teacherWalletService.updateAmount(wallet.id, {
      amount: -transaction.amount,
    });

    await transaction.destroy(); // Soft delete since paranoid is enabled
  }
}
