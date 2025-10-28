import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentTransactionService } from './student-transaction.service.js';
import { StudentTransactionController } from './student-transaction.controller.js';
import { StudentTransaction } from './entities/student-transaction.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([StudentTransaction])],
  controllers: [StudentTransactionController],
  providers: [StudentTransactionService],
  exports: [StudentTransactionService],
})
export class StudentTransactionModule {}
