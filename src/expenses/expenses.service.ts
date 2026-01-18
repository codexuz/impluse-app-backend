import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { CreateExpenseDto } from "./dto/create-expense.dto.js";
import { UpdateExpenseDto } from "./dto/update-expense.dto.js";
import { CreateExpenseCategoryDto } from "./dto/create-expense-category.dto.js";
import { UpdateExpenseCategoryDto } from "./dto/update-expense-category.dto.js";
import { PaginationDto } from "./dto/pagination.dto.js";
import { Expense } from "./entities/expense.entity.js";
import { ExpensesCategory } from "./entities/expenses-category.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
    @InjectModel(ExpensesCategory)
    private expensesCategoryModel: typeof ExpensesCategory,
    @InjectModel(TeacherWallet)
    private teacherWalletModel: typeof TeacherWallet,
    @InjectModel(TeacherTransaction)
    private teacherTransactionModel: typeof TeacherTransaction
  ) {}

  // ============= EXPENSES METHODS =============

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Start a transaction to ensure atomicity
    const transaction = await this.expenseModel.sequelize.transaction();

    try {
      // Create the expense record
      const expense = await this.expenseModel.create(createExpenseDto as any, {
        transaction,
      });

      // If teacher_id is provided, handle wallet operations based on category
      if (createExpenseDto.teacher_id) {
        // Get the expense category
        const category = await this.expensesCategoryModel.findByPk(
          createExpenseDto.category_id,
          { transaction }
        );

        if (!category) {
          throw new BadRequestException("Expense category not found");
        }

        const categoryName = category.name.toLowerCase();

        // Handle different category types
        if (categoryName === "avans" || categoryName === "oylik") {
          // Deduct amount from teacher wallet
          await this.deductFromTeacherWallet(
            createExpenseDto.teacher_id,
            expense.amount,
            categoryName as "avans" | "oylik",
            transaction
          );
        } else if (categoryName === "bonus") {
          // Add amount to teacher wallet
          await this.addToTeacherWallet(
            createExpenseDto.teacher_id,
            expense.amount,
            "bonus",
            transaction
          );
        }
      }

      // Commit the transaction
      await transaction.commit();

      return expense;
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Deduct amount from teacher wallet and create transaction
   */
  private async deductFromTeacherWallet(
    teacherId: string,
    amount: number,
    type: "avans" | "oylik",
    transaction: any
  ): Promise<void> {
    // Find or create teacher wallet
    let wallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: teacherId },
      transaction,
    });

    if (!wallet) {
      // Create wallet with negative balance if it doesn't exist
      wallet = await this.teacherWalletModel.create(
        {
          teacher_id: teacherId,
          amount: -amount,
        },
        { transaction }
      );
    } else {
      // Deduct amount from existing wallet
      const newAmount = wallet.amount - amount;
      await wallet.update({ amount: newAmount }, { transaction });
    }

    // Create teacher transaction record
    await this.teacherTransactionModel.create(
      {
        teacher_id: teacherId,
        amount: -amount, // Negative for deduction
        type: type,
      },
      { transaction }
    );
  }

  /**
   * Add amount to teacher wallet and create transaction
   */
  private async addToTeacherWallet(
    teacherId: string,
    amount: number,
    type: "bonus",
    transaction: any
  ): Promise<void> {
    // Find or create teacher wallet
    let wallet = await this.teacherWalletModel.findOne({
      where: { teacher_id: teacherId },
      transaction,
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await this.teacherWalletModel.create(
        {
          teacher_id: teacherId,
          amount: amount,
        },
        { transaction }
      );
    } else {
      // Add amount to existing wallet
      const newAmount = wallet.amount + amount;
      await wallet.update({ amount: newAmount }, { transaction });
    }

    // Create teacher transaction record
    await this.teacherTransactionModel.create(
      {
        teacher_id: teacherId,
        amount: amount, // Positive for bonus
        type: type,
      },
      { transaction }
    );
  }

  async findAll(
    categoryId?: string,
    teacherId?: string,
    reportedBy?: string,
    pagination?: PaginationDto
  ): Promise<{
    data: Expense[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const whereCondition: any = {};

    if (categoryId) {
      whereCondition.category_id = categoryId;
    }

    if (teacherId) {
      whereCondition.teacher_id = teacherId;
    }

    if (reportedBy) {
      whereCondition.reported_by = reportedBy;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.expenseModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: this.expensesCategoryModel,
          as: "category",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findByPk(id, {
      include: [
        {
          model: this.expensesCategoryModel,
          as: "category",
        },
      ],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }

    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto
  ): Promise<Expense> {
    const expense = await this.findOne(id);

    await expense.update(updateExpenseDto as any);

    return expense;
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id);

    await expense.destroy(); // Soft delete since paranoid is enabled
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    pagination?: PaginationDto
  ): Promise<{
    data: Expense[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.expenseModel.findAndCountAll({
      where: {
        expense_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: this.expensesCategoryModel,
          as: "category",
        },
      ],
      order: [["expense_date", "DESC"]],
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getTotalExpensesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{ total: number; count: number }> {
    const expenses = await this.expenseModel.findAll({
      where: {
        expense_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      total,
      count: expenses.length,
    };
  }

  async findByMonth(
    year: number,
    month: number,
    pagination?: PaginationDto
  ): Promise<{
    data: Expense[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const startDate = new Date(year, month - 1, 1); // month is 0-indexed
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month

    return this.findByDateRange(startDate, endDate, pagination);
  }

  // ============= EXPENSE CATEGORIES METHODS =============

  async createCategory(
    createExpenseCategoryDto: CreateExpenseCategoryDto
  ): Promise<ExpensesCategory> {
    return await this.expensesCategoryModel.create(
      createExpenseCategoryDto as any
    );
  }

  async findAllCategories(): Promise<ExpensesCategory[]> {
    return await this.expensesCategoryModel.findAll({
      order: [["name", "ASC"]],
    });
  }

  async findOneCategory(id: string): Promise<ExpensesCategory> {
    const category = await this.expensesCategoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException(`Expense category with ID "${id}" not found`);
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateExpenseCategoryDto: UpdateExpenseCategoryDto
  ): Promise<ExpensesCategory> {
    const category = await this.findOneCategory(id);

    await category.update(updateExpenseCategoryDto as any);

    return category;
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findOneCategory(id);

    await category.destroy(); // Soft delete since paranoid is enabled
  }

  /**
   * Get teacher salary history by filtering 'oylik' category expenses
   * @param teacherId - Optional teacher ID. If not provided, returns all teachers' salary history
   * @param startDate - Optional start date. If not provided, defaults to 30 days ago
   * @param endDate - Optional end date. If not provided, defaults to today
   */
  async getTeacherSalaryHistory(
    teacherId?: string,
    startDate?: Date,
    endDate?: Date,
    pagination?: PaginationDto
  ): Promise<{
    expenses: Expense[];
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Set default date range to last 30 days if not provided
    const now = new Date();
    const defaultStartDate = new Date(now);
    defaultStartDate.setDate(now.getDate() - 30);

    const finalStartDate = startDate || defaultStartDate;
    const finalEndDate = endDate || now;

    // Find the 'oylik' category
    const oylikCategory = await this.expensesCategoryModel.findOne({
      where: {
        name: { [Op.like]: "oylik" },
      },
    });

    if (!oylikCategory) {
      throw new NotFoundException("Oylik category not found");
    }

    // Build where clause
    const whereClause: any = {
      category_id: oylikCategory.id,
      expense_date: {
        [Op.between]: [finalStartDate, finalEndDate],
      },
    };

    // Add teacher_id filter only if provided
    if (teacherId) {
      whereClause.teacher_id = teacherId;
    }

    // Find all expenses with oylik category in date range
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.expenseModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: this.expensesCategoryModel,
          as: "category",
        },
      ],
      order: [["expense_date", "DESC"]],
      limit,
      offset,
    });

    const total = rows.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      expenses: rows,
      total,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}
