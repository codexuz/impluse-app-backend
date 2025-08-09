import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VocabularySetsService } from './vocabulary_sets.service.js';
import { VocabularySetsController } from './vocabulary_sets.controller.js';
import { VocabularySet } from './entities/vocabulary_set.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([VocabularySet])
  ],
  controllers: [VocabularySetsController],
  providers: [VocabularySetsService],
  exports: [VocabularySetsService, SequelizeModule]
})
export class VocabularySetsModule {}
