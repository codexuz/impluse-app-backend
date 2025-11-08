import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpensesService } from './expenses.service.js';
import { ExpensesController } from './expenses.controller.js';
import { ExpenseCategoriesController } from './expense-categories.controller.js';
import { Expense } from './entities/expense.entity.js';
import { ExpensesCategory } from './entities/expenses-category.entity.js';
import { TeacherWallet } from '../teacher-wallet/entities/teacher-wallet.entity.js';
import { TeacherTransaction } from '../teacher-transaction/entities/teacher-transaction.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([Expense, ExpensesCategory, TeacherWallet, TeacherTransaction])],
  controllers: [ExpensesController, ExpenseCategoriesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
