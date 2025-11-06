var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Expense } from './entities/expense.entity.js';
import { ExpensesCategory } from './entities/expenses-category.entity.js';
let ExpensesService = class ExpensesService {
    constructor(expenseModel, expensesCategoryModel) {
        this.expenseModel = expenseModel;
        this.expensesCategoryModel = expensesCategoryModel;
    }
    async create(createExpenseDto) {
        return await this.expenseModel.create(createExpenseDto);
    }
    async findAll(categoryId, teacherId, reportedBy) {
        const whereCondition = {};
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
    async findOne(id) {
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
    async update(id, updateExpenseDto) {
        const expense = await this.findOne(id);
        await expense.update(updateExpenseDto);
        return expense;
    }
    async remove(id) {
        const expense = await this.findOne(id);
        await expense.destroy();
    }
    async findByDateRange(startDate, endDate) {
        return await this.expenseModel.findAll({
            where: {
                expense_date: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: this.expensesCategoryModel,
                    as: 'category',
                },
            ],
            order: [['expense_date', 'DESC']],
        });
    }
    async getTotalExpensesByDateRange(startDate, endDate) {
        const expenses = await this.findByDateRange(startDate, endDate);
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        return {
            total,
            count: expenses.length,
        };
    }
    async findByMonth(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        return this.findByDateRange(startDate, endDate);
    }
    async createCategory(createExpenseCategoryDto) {
        return await this.expensesCategoryModel.create(createExpenseCategoryDto);
    }
    async findAllCategories() {
        return await this.expensesCategoryModel.findAll({
            order: [['name', 'ASC']],
        });
    }
    async findOneCategory(id) {
        const category = await this.expensesCategoryModel.findByPk(id);
        if (!category) {
            throw new NotFoundException(`Expense category with ID "${id}" not found`);
        }
        return category;
    }
    async updateCategory(id, updateExpenseCategoryDto) {
        const category = await this.findOneCategory(id);
        await category.update(updateExpenseCategoryDto);
        return category;
    }
    async removeCategory(id) {
        const category = await this.findOneCategory(id);
        await category.destroy();
    }
};
ExpensesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Expense)),
    __param(1, InjectModel(ExpensesCategory)),
    __metadata("design:paramtypes", [Object, Object])
], ExpensesService);
export { ExpensesService };
//# sourceMappingURL=expenses.service.js.map