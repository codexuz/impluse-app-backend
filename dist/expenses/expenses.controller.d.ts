import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto.js';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto.js';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    create(createExpenseDto: CreateExpenseDto): Promise<import("./entities/expense.entity.js").Expense>;
    findAll(categoryId?: string, teacherId?: string, reportedBy?: string): Promise<import("./entities/expense.entity.js").Expense[]>;
    findOne(id: string): Promise<import("./entities/expense.entity.js").Expense>;
    update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<import("./entities/expense.entity.js").Expense>;
    remove(id: string): Promise<void>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./entities/expense.entity.js").Expense[]>;
    findByMonth(year: number, month: number): Promise<import("./entities/expense.entity.js").Expense[]>;
    getTotalExpensesByDateRange(startDate: string, endDate: string): Promise<{
        total: number;
        count: number;
    }>;
    createCategory(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<import("./entities/expenses-category.entity.js").ExpensesCategory>;
    findAllCategories(): Promise<import("./entities/expenses-category.entity.js").ExpensesCategory[]>;
    findOneCategory(id: string): Promise<import("./entities/expenses-category.entity.js").ExpensesCategory>;
    updateCategory(id: string, updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<import("./entities/expenses-category.entity.js").ExpensesCategory>;
    removeCategory(id: string): Promise<void>;
}
