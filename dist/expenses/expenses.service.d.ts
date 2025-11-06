import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto.js';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto.js';
import { Expense } from './entities/expense.entity.js';
import { ExpensesCategory } from './entities/expenses-category.entity.js';
export declare class ExpensesService {
    private expenseModel;
    private expensesCategoryModel;
    constructor(expenseModel: typeof Expense, expensesCategoryModel: typeof ExpensesCategory);
    create(createExpenseDto: CreateExpenseDto): Promise<Expense>;
    findAll(categoryId?: string, teacherId?: string, reportedBy?: string): Promise<Expense[]>;
    findOne(id: string): Promise<Expense>;
    update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense>;
    remove(id: string): Promise<void>;
    createCategory(createExpenseCategoryDto: CreateExpenseCategoryDto): Promise<ExpensesCategory>;
    findAllCategories(): Promise<ExpensesCategory[]>;
    findOneCategory(id: string): Promise<ExpensesCategory>;
    updateCategory(id: string, updateExpenseCategoryDto: UpdateExpenseCategoryDto): Promise<ExpensesCategory>;
    removeCategory(id: string): Promise<void>;
}
