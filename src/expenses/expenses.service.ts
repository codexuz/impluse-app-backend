import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto.js';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto.js';
import { Expense } from './entities/expense.entity.js';
import { ExpensesCategory } from './entities/expenses-category.entity.js';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense)
    private expenseModel: typeof Expense,
    @InjectModel(ExpensesCategory)
    private expensesCategoryModel: typeof ExpensesCategory,
  ) {}

  // ============= EXPENSES METHODS =============

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return await this.expenseModel.create(createExpenseDto as any);
  }

  async findAll(categoryId?: string, teacherId?: string, reportedBy?: string): Promise<Expense[]> {
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

    return await this.expenseModel.findAll({
      where: whereCondition,
      include: [
        {
          model: this.expensesCategoryModel,
          as: 'category',
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel.findByPk(id, {
      include: [
        {
          model: this.expensesCategoryModel,
          as: 'category',
        },
      ],
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(id);

    await expense.update(updateExpenseDto as any);

    return expense;
  }

  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id);

    await expense.destroy(); // Soft delete since paranoid is enabled
  }

  // ============= EXPENSE CATEGORIES METHODS =============

  async createCategory(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpensesCategory> {
    return await this.expensesCategoryModel.create(createExpenseCategoryDto as any);
  }

  async findAllCategories(): Promise<ExpensesCategory[]> {
    return await this.expensesCategoryModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOneCategory(id: string): Promise<ExpensesCategory> {
    const category = await this.expensesCategoryModel.findByPk(id);

    if (!category) {
      throw new NotFoundException(`Expense category with ID "${id}" not found`);
    }

    return category;
  }

  async updateCategory(id: string, updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpensesCategory> {
    const category = await this.findOneCategory(id);

    await category.update(updateExpenseCategoryDto as any);

    return category;
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findOneCategory(id);

    await category.destroy(); // Soft delete since paranoid is enabled
  }
}
