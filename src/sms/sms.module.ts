import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service.js';
import { SmsController } from './sms.controller.js';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
