import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentPaymentService } from './student-payment.service.js';
import { StudentPaymentController } from './student-payment.controller.js';
import { StudentPayment } from './entities/student-payment.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([StudentPayment])
  ],
  controllers: [StudentPaymentController],
  providers: [StudentPaymentService],
  exports: [StudentPaymentService, SequelizeModule]
})
export class StudentPaymentModule {}