import { Module } from '@nestjs/common';
import { HomeworkSubmissionsService } from './homework_submissions.service.js';
import { HomeworkSubmissionsController } from './homework_submissions.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';    
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([HomeworkSubmission])],
  controllers: [HomeworkSubmissionsController],
  providers: [HomeworkSubmissionsService],  
  exports: [HomeworkSubmissionsService],
})
export class HomeworkSubmissionsModule {}
