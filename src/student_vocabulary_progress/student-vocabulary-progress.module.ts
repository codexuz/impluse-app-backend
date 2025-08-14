import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { StudentVocabularyProgressService } from './student-vocabulary-progress.service.js';
import { StudentVocabularyProgressController } from './student-vocabulary-progress.controller.js';

@Module({
  imports: [SequelizeModule.forFeature([StudentVocabularyProgress])],
  controllers: [StudentVocabularyProgressController],
  providers: [StudentVocabularyProgressService],
  exports: [StudentVocabularyProgressService],
})
export class StudentVocabularyProgressModule {}
