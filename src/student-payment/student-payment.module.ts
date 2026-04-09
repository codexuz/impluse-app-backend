import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentPaymentService } from './student-payment.service.js';
import { StudentPaymentController } from './student-payment.controller.js';
import { StudentPayment } from './entities/student-payment.entity.js';
import { StudentWallet } from '../student-wallet/entities/student-wallet.entity.js';
import { StudentTransaction } from '../student-transaction/entities/student-transaction.entity.js';
import { User } from '../users/entities/user.entity.js';
import { SmsModule } from '../sms/sms.module.js';
import { TelegramBotModule } from '../telegram-bot/telegram-bot.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([StudentPayment, StudentWallet, StudentTransaction, User]),
    SmsModule,
    forwardRef(() => TelegramBotModule),
  ],
  controllers: [StudentPaymentController],
  providers: [StudentPaymentService],
  exports: [StudentPaymentService, SequelizeModule]
})
export class StudentPaymentModule {}