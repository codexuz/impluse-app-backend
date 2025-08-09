import { Module } from '@nestjs/common';
import { Ieltspart1QuestionService } from './ieltspart1-question.service.js';
import { Ieltspart1QuestionController } from './ieltspart1-question.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ieltspart1Question } from './entities/ieltspart1-question.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([Ieltspart1Question])],
  controllers: [Ieltspart1QuestionController],
  providers: [Ieltspart1QuestionService],
  exports: [Ieltspart1QuestionService],
})
export class Ieltspart1QuestionModule {}
