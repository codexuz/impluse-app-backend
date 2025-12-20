import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VocabularySetsService } from './vocabulary_sets.service.js';
import { VocabularySetsController } from './vocabulary_sets.controller.js';
import { VocabularySet } from './entities/vocabulary_set.entity.js';
import { VocabularyItem } from '../vocabulary_items/entities/vocabulary_item.entity.js';
import { StudentVocabularyProgress } from '../student_vocabulary_progress/entities/student_vocabulary_progress.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([VocabularySet, VocabularyItem, StudentVocabularyProgress])
  ],
  controllers: [VocabularySetsController],
  providers: [VocabularySetsService],
  exports: [VocabularySetsService, SequelizeModule]
})
export class VocabularySetsModule {}