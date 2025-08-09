import { Module } from '@nestjs/common';
import { Ieltspart3QuestionService } from './ieltspart3-question.service.js';
import { Ieltspart3QuestionController } from './ieltspart3-question.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([Ieltspart3Question])],
  controllers: [Ieltspart3QuestionController],
  providers: [Ieltspart3QuestionService],
  exports: [Ieltspart3QuestionService],
})
export class Ieltspart3QuestionModule {}
