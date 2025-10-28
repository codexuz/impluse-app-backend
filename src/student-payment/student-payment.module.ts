import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentPaymentService } from './student-payment.service.js';
import { StudentPaymentController } from './student-payment.controller.js';
import { StudentPayment } from './entities/student-payment.entity.js';
import { StudentWallet } from '../student-wallet/entities/student-wallet.entity.js';
import { StudentTransaction } from '../student-transaction/entities/student-transaction.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([StudentPayment, StudentWallet, StudentTransaction])
  ],
  controllers: [StudentPaymentController],
  providers: [StudentPaymentService],
  exports: [StudentPaymentService, SequelizeModule]
})
export class StudentPaymentModule {}