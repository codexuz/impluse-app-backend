import { Module } from '@nestjs/common';
import { LessonContentService } from './lesson-content.service.js';
import { LessonContentController } from './lesson-content.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { LessonContent } from './entities/lesson-content.entity.js';    
@Module({
  imports: [
    SequelizeModule.forFeature([LessonContent]),
  ],
  controllers: [LessonContentController],
  providers: [LessonContentService],
  exports: [LessonContentService],
})
export class LessonContentModule {}
