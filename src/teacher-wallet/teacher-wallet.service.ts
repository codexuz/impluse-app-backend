import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Cron } from "@nestjs/schedule";
import { CreateTeacherWalletDto } from "./dto/create-teacher-wallet.dto.js";
import { UpdateTeacherWalletDto } from "./dto/update-teacher-wallet.dto.js";
import { UpdateWalletAmountDto } from "./dto/update-wallet-amount.dto.js";
import { TeacherWallet } from "./entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
import { User } from "../users/entities/user.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { CompensateTeacherWallet } from "../compensate-lessons/entities/compensate-teacher-wallet.entity.js";
import { Op, Sequelize } from "sequelize";
import {
  GetTeachersWithStatsDto,
  TeachersWithStatsResponse,
  TeacherWithStats,
} from "./dto/get-teachers-with-stats.dto.js";

@Injectable()
export class TeacherWalletService {
  private readonly logger = new Logger(TeacherWalletService.name);

  constructor(
    @InjectModel(TeacherWallet)
    private teacherWalletModel: typeof TeacherWallet,
    @InjectModel(TeacherTransaction)
    private teacherTransactionModel: typeof TeacherTransaction,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(TeacherProfile)
    private teacherProfileModel: typeof TeacherProfile,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(GroupStudent)
    private groupStudentModel: typeof GroupStudent,
    @InjectModel(CompensateTeacherWallet)
    private compensateTeacherWalletModel: typeof CompensateTeacherWallet,
  ) {}

  async create(
    createTeacherWalletDto: CreateTeacherWalletDto,
  ): Promise<TeacherWallet> {
    // Check if wallet already exists for this teacher
    const existingWallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: createTeacherWalletDto.teacher_id },
    });

    if (existingWallet) {
      throw new ConflictException("Wallet already exists for this teacher");
    }

    return await this.teacherWalletModel.create(createTeacherWalletDto as any);
  }

  async findAll(): Promise<TeacherWallet[]> {
    return await this.teacherWalletModel.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async findByTeacherId(teacherId: string): Promise<TeacherWallet> {
    const wallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: teacherId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for teacher with ID "${teacherId}" not found`,
      );
    }

    return wallet;
  }

  async findOne(id: string): Promise<TeacherWallet> {
    const wallet = await this.teacherWalletModel.findByPk(id);

    if (!wallet) {
      throw new NotFoundException(`Teacher wallet with ID "${id}" not found`);
    }

    return wallet;
  }

  async update(
    id: string,
    updateTeacherWalletDto: UpdateTeacherWalletDto,
  ): Promise<TeacherWallet> {
    const wallet = await this.findOne(id);

    await wallet.update(updateTeacherWalletDto as any);

    return wallet;
  }

  async updateAmount(
    id: string,
    updateWalletAmountDto: UpdateWalletAmountDto,
  ): Promise<TeacherWallet> {
    const wallet = await this.findOne(id);

    // Use atomic increment/decrement to avoid race conditions
    const amount = updateWalletAmountDto.amount;
    if (amount >= 0) {
      await wallet.increment('amount', { by: amount });
    } else {
      await wallet.decrement('amount', { by: Math.abs(amount) });
    }

    await wallet.reload();
    return wallet;
  }

  async findOrCreate(teacherId: string): Promise<TeacherWallet> {
    const [wallet] = await this.teacherWalletModel.findOrCreate({
      where: { teacher_id: teacherId },
      defaults: {
        teacher_id: teacherId,
        amount: 0,
      } as any,
    });
    return wallet;
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.findOne(id);

    await wallet.destroy(); // Soft delete since paranoid is enabled
  }

  @Cron('0 20 * * *', { timeZone: 'Asia/Tashkent' })
  async processMonthlyTeacherSalaries() {
    const today = new Date().getDate();
    this.logger.log(`Running monthly salary cron for payment_day=${today}`);

    const profiles = await this.teacherProfileModel.findAll({
      where: { payment_day: today, payment_type: 'percentage' },
    });

    if (profiles.length === 0) {
      this.logger.log('No teachers scheduled for payment today');
      return;
    }

    // Boundaries of the current month in UTC+5 (Asia/Tashkent, same as the
    // cron schedule), used to detect an already-paid salary.
    const UTC5_OFFSET_MS = 5 * 60 * 60 * 1000;
    const nowUtc5 = new Date(Date.now() + UTC5_OFFSET_MS);
    const year = nowUtc5.getUTCFullYear();
    const month = nowUtc5.getUTCMonth();
    const monthStart = new Date(Date.UTC(year, month, 1, 0, 0, 0) - UTC5_OFFSET_MS);
    const monthEnd = new Date(
      Date.UTC(year, month + 1, 0, 23, 59, 59) - UTC5_OFFSET_MS,
    );

    for (const profile of profiles) {
      try {
        const wallet = await this.teacherWalletModel.findOne({
          where: { teacher_id: profile.user_id },
        });

        if (!wallet || wallet.amount <= 0) {
          this.logger.warn(`Teacher ${profile.user_id} has no balance to pay`);
          continue;
        }

        // Skip if salary was already paid this month (manually or by a
        // previous auto-run) to prevent a double payment.
        const existingPayment = await this.teacherTransactionModel.findOne({
          where: {
            teacher_id: profile.user_id,
            type: 'oylik',
            created_at: {
              [Op.gte]: monthStart,
              [Op.lte]: monthEnd,
            },
          },
        });

        if (existingPayment) {
          this.logger.warn(
            `Teacher ${profile.user_id} already has an 'oylik' payment for this month, skipping auto-payment`,
          );
          continue;
        }

        const amount = wallet.amount;

        await this.teacherTransactionModel.create({
          teacher_id: profile.user_id,
          amount,
          type: 'oylik',
          description: `Oylik maosh to'landi (${new Date().toLocaleDateString('uz-UZ')})`,
        } as any);

        // Atomically decrement by the recorded amount instead of setting to 0,
        // so concurrent attendance increments aren't lost.
        await wallet.decrement('amount', { by: amount });

        this.logger.log(`Salary paid for teacher ${profile.user_id}, amount: ${amount}`);
      } catch (error: any) {
        this.logger.error(`Failed to process salary for teacher ${profile.user_id}: ${error.message}`);
      }
    }
  }

  async getTeachersWithStats(
    filters: GetTeachersWithStatsDto,
  ): Promise<TeachersWithStatsResponse> {
    const {
      page = 1,
      limit = 10,
      query,
      branch_id,
      payment_type,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = filters;

    const offset = (page - 1) * limit;

    // Build where clause for TeacherProfile
    const teacherProfileWhereClause: any = {};
    if (payment_type) {
      teacherProfileWhereClause.payment_type = payment_type;
    }

    // First, get teacher profiles with filters
    const teacherProfiles = await this.teacherProfileModel.findAll({
      where: teacherProfileWhereClause,
      raw: true,
    });

    const teacherUserIds = teacherProfiles.map((tp) => tp.user_id);

    // Build where clause for User
    const userWhereClause: any = {
      user_id: { [Op.in]: teacherUserIds },
      is_active: true,
    };

    // Search by name, username, or phone
    if (query) {
      userWhereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${query}%` } },
        { last_name: { [Op.iLike]: `%${query}%` } },
        { username: { [Op.iLike]: `%${query}%` } },
        { phone: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (branch_id) {
      userWhereClause.branch_id = branch_id;
    }

    // Get users with pagination and sorting
    const { rows: users, count: totalCount } =
      await this.userModel.findAndCountAll({
        where: userWhereClause,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        raw: true,
      });

    // If no users found, return empty result
    if (users.length === 0) {
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    const teacherIds = users.map((u) => u.user_id);

    // Create a map of user_id to teacher profile
    const teacherProfileMap = new Map(
      teacherProfiles
        .filter((tp) => teacherIds.includes(tp.user_id))
        .map((tp) => [tp.user_id, tp]),
    );

    // Batch query for groups count (active groups only)
    const groupsCountResult = await this.groupModel.findAll({
      attributes: [
        "teacher_id",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "groupsCount"],
      ],
      where: {
        teacher_id: { [Op.in]: teacherIds },
        isDeleted: false,
      },
      group: ["teacher_id"],
      raw: true,
    });

    const groupsCountMap = new Map(
      groupsCountResult.map((g: any) => [
        g.teacher_id,
        parseInt(g.groupsCount),
      ]),
    );

    // Batch query for students count (active students in active groups only)
    const studentsCountResult = await this.groupStudentModel.findAll({
      attributes: [
        [Sequelize.col("group.teacher_id"), "teacher_id"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("GroupStudent.student_id")),
          ),
          "studentsCount",
        ],
      ],
      where: {
        status: "active",
      },
      include: [
        {
          model: this.groupModel,
          as: "group",
          attributes: [],
          where: {
            teacher_id: { [Op.in]: teacherIds },
            isDeleted: false,
          },
          required: true,
        },
      ],
      group: [Sequelize.col("group.teacher_id")],
      raw: true,
    });

    const studentsCountMap = new Map(
      studentsCountResult.map((s: any) => [
        s.teacher_id,
        parseInt(s.studentsCount),
      ]),
    );

    // Batch query for wallet balance
    const walletBalanceResult = await this.teacherWalletModel.findAll({
      attributes: ["teacher_id", "amount"],
      where: {
        teacher_id: { [Op.in]: teacherIds },
      },
      raw: true,
    });

    const walletBalanceMap = new Map(
      walletBalanceResult.map((w: any) => [w.teacher_id, w.amount || 0]),
    );

    // Batch query for compensate balance (unpaid amounts)
    const compensateBalanceResult =
      await this.compensateTeacherWalletModel.findAll({
        attributes: [
          "teacher_id",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "compensateBalance"],
        ],
        where: {
          teacher_id: { [Op.in]: teacherIds },
          isPaid: false,
        },
        group: ["teacher_id"],
        raw: true,
      });

    const compensateBalanceMap = new Map(
      compensateBalanceResult.map((c: any) => [
        c.teacher_id,
        parseFloat(c.compensateBalance) || 0,
      ]),
    );

    // Map results to response format
    const data: TeacherWithStats[] = users.map((user: any) => {
      const teacherProfile = teacherProfileMap.get(user.user_id);
      return {
        user_id: user.user_id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        avatar_url: user.avatar_url,
        branch_id: teacherProfile?.branch_id || user.branch_id,
        payment_type: teacherProfile?.payment_type || null,
        payment_value: teacherProfile?.payment_value || 0,
        groupsCount: groupsCountMap.get(user.user_id) || 0,
        studentsCount: studentsCountMap.get(user.user_id) || 0,
        walletBalance: walletBalanceMap.get(user.user_id) || 0,
        compensateBalance: compensateBalanceMap.get(user.user_id) || 0,
        created_at: user.created_at,
      };
    });

    return {
      data,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
