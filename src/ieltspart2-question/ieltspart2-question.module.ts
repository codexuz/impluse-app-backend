import { Module } from '@nestjs/common';
import { Ieltspart2QuestionService } from './ieltspart2-question.service.js';
import { Ieltspart2QuestionController } from './ieltspart2-question.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';  
@Module({
  imports: [SequelizeModule.forFeature([Ieltspart2Question])],
  controllers: [Ieltspart2QuestionController],
  providers: [Ieltspart2QuestionService],
  exports: [Ieltspart2QuestionService],
})
export class Ieltspart2QuestionModule {}
