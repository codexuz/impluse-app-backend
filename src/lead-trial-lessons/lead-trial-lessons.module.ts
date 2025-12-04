import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadTrialLessonsService } from './lead-trial-lessons.service.js';
import { LeadTrialLessonsController } from './lead-trial-lessons.controller.js';
import { LeadTrialLesson } from './entities/lead-trial-lesson.entity.js';
import { Lead } from '../leads/entities/lead.entity.js';
import { SmsModule } from '../sms/sms.module.js';

@Module({
  imports: [
    SequelizeModule.forFeature([LeadTrialLesson, Lead]),
    SmsModule
  ],
  controllers: [LeadTrialLessonsController],
  providers: [LeadTrialLessonsService],
  exports: [LeadTrialLessonsService, SequelizeModule]
})
export class LeadTrialLessonsModule {}
