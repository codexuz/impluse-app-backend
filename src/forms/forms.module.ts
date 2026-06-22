import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FormsService } from './forms.service.js';
import { FormsController } from './forms.controller.js';
import { Form } from './entities/form.entity.js';
import { Response } from './entities/response.entity.js';
import { SmsVerification } from '../users/entities/sms-verification.model.js';
import { SmsModule } from '../sms/sms.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Form, Response, SmsVerification]),
    SmsModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
