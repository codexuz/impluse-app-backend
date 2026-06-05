import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBonusPenaltyTransactionDto } from "./dto/create-bonus-penalty-transaction.dto.js";
import { UpdateBonusPenaltyTransactionDto } from "./dto/update-bonus-penalty-transaction.dto.js";
import { QueryBonusPenaltyTransactionDto } from "./dto/query-bonus-penalty-transaction.dto.js";
import { BonusPenaltyTransaction } from "./entities/bonus-penalty-transaction.entity.js";
import { BonusPenaltyWalletService } from "./bonus-penalty-wallet.service.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Lead } from "../leads/entities/lead.entity.js";
import { BonusPenaltyCategory } from "./entities/bonus-penalty-category.entity.js";
import { Op } from "sequelize";

// Default referral bonus used when the caller does not pass an explicit amount.
export const DEFAULT_REFERRAL_BONUS = parseInt(
  process.env.REFERRAL_BONUS_AMOUNT || "50000",
  10,
);

export interface PayReferralBonusParams {
  // Explicitly appended teacher to credit. When omitted it is resolved from
  // the referring student's most recent active group.
  teacher_id?: string;
  student_id: string;
  lead_id?: string;
  branch_id?: string;
  amount?: number;
  description?: string;
}

@Injectable()
export class BonusPenaltyTransactionService {
  private readonly logger = new Logger(BonusPenaltyTransactionService.name);

  constructor(
    @InjectModel(BonusPenaltyTransaction)
    private bonusPenaltyTransactionModel: typeof BonusPenaltyTransaction,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    private bonusPenaltyWalletService: BonusPenaltyWalletService,
  ) {}

  async create(
    createBonusPenaltyTransactionDto: CreateBonusPenaltyTransactionDto,
  ): Promise<BonusPenaltyTransaction> {
    const transaction = await this.bonusPenaltyTransactionModel.create(
      createBonusPenaltyTransactionDto as any,
    );

    // Update the teacher's bonus & penalty wallet balance.
    const { teacher_id, amount, type } = createBonusPenaltyTransactionDto;

    const wallet = await this.bonusPenaltyWalletService.findOrCreate(teacher_id);

    // bonus & referal credit the wallet; jarima (penalty) debits it.
    const balanceChange = type === "jarima" ? -amount : amount;

    await this.bonusPenaltyWalletService.updateAmount(wallet.id, {
      amount: balanceChange,
    });

    return transaction;
  }

  /**
   * Resolve the teacher of a referring student from their most recent active
   * group enrollment. Returns null when the student is not in any active group.
   */
  async resolveTeacherForStudent(
    studentId: string,
  ): Promise<{ teacher_id: string; branch_id: string | null } | null> {
    const enrollment = await this.groupStudentModel.findOne({
      where: { student_id: studentId, status: "active" },
      include: [
        {
          model: Group,
          as: "group",
          attributes: ["teacher_id", "branch_id"],
          required: true,
        },
      ],
      order: [["enrolled_at", "DESC"]],
    });

    const group = (enrollment as any)?.group as Group | undefined;
    if (!group || !group.teacher_id) {
      return null;
    }

    return {
      teacher_id: group.teacher_id,
      branch_id: group.branch_id ?? null,
    };
  }

  /**
   * Pay a referral bonus to the teacher of the referring student. Used when a
   * referred lead converts (enrolls). Returns the created transaction, or null
   * when no eligible teacher could be determined.
   */
  async payReferralBonus(
    params: PayReferralBonusParams,
  ): Promise<BonusPenaltyTransaction | null> {
    let teacherId = params.teacher_id;
    let branchId = params.branch_id ?? null;

    if (!teacherId) {
      const resolved = await this.resolveTeacherForStudent(params.student_id);
      if (!resolved) {
        this.logger.warn(
          `No active teacher found for referring student ${params.student_id}; skipping referral bonus`,
        );
        return null;
      }
      teacherId = resolved.teacher_id;
      branchId = branchId ?? resolved.branch_id;
    }

    const amount =
      params.amount && params.amount > 0
        ? params.amount
        : DEFAULT_REFERRAL_BONUS;

    return this.create({
      teacher_id: teacherId,
      student_id: params.student_id,
      lead_id: params.lead_id,
      branch_id: branchId ?? undefined,
      amount,
      type: "referal" as any,
      description:
        params.description ||
        `Referal bonus: o'quvchi taklif qilgan lead o'qishga yozildi`,
    });
  }

  async findAll(queryDto: QueryBonusPenaltyTransactionDto): Promise<{
    data: BonusPenaltyTransaction[];
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
      category_id,
      search,
      start_date,
      end_date,
    } = queryDto;

    const whereCondition: any = {};

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

    if (category_id) {
      whereCondition.category_id = category_id;
    }

    if (start_date || end_date) {
      whereCondition.created_at = {};
      if (start_date) {
        whereCondition.created_at[Op.gte] = new Date(start_date);
      }
      if (end_date) {
        whereCondition.created_at[Op.lte] = new Date(end_date);
      }
    }

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
      {
        model: BonusPenaltyCategory,
        as: "category",
        attributes: ["id", "name", "type"],
        required: false,
      },
      {
        model: Lead,
        as: "lead",
        attributes: ["id", "first_name", "last_name", "phone", "status"],
        required: false,
      },
    ];

    if (search) {
      whereCondition[Op.or] = [
        { "$teacher.first_name$": { [Op.iLike]: `%${search}%` } },
        { "$teacher.last_name$": { [Op.iLike]: `%${search}%` } },
        { "$teacher.username$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const total = await this.bonusPenaltyTransactionModel.count({
      where: whereCondition,
      include,
      distinct: true,
    });

    const allFilteredTransactions =
      await this.bonusPenaltyTransactionModel.findAll({
        where: whereCondition,
        include,
        attributes: ["amount"],
      });

    const totalAmount = allFilteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    const data = await this.bonusPenaltyTransactionModel.findAll({
      where: whereCondition,
      include,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      totalAmount,
    };
  }

  async findByTeacherId(
    teacherId: string,
    type?: string,
  ): Promise<BonusPenaltyTransaction[]> {
    const whereCondition: any = { teacher_id: teacherId };

    if (type) {
      whereCondition.type = type;
    }

    return await this.bonusPenaltyTransactionModel.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
    });
  }

  async findOne(id: string): Promise<BonusPenaltyTransaction> {
    const transaction = await this.bonusPenaltyTransactionModel.findByPk(id);

    if (!transaction) {
      throw new NotFoundException(
        `Bonus & penalty transaction with ID "${id}" not found`,
      );
    }

    return transaction;
  }

  async update(
    id: string,
    updateBonusPenaltyTransactionDto: UpdateBonusPenaltyTransactionDto,
  ): Promise<BonusPenaltyTransaction> {
    const transaction = await this.findOne(id);

    await transaction.update(updateBonusPenaltyTransactionDto as any);

    return transaction;
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.findOne(id);

    // Reverse the effect of this transaction on the wallet balance.
    const wallet = await this.bonusPenaltyWalletService.findByTeacherId(
      transaction.teacher_id,
    );
    const reversal =
      transaction.type === "jarima"
        ? transaction.amount
        : -transaction.amount;
    await this.bonusPenaltyWalletService.updateAmount(wallet.id, {
      amount: reversal,
    });

    await transaction.destroy(); // Soft delete since paranoid is enabled
  }
}
