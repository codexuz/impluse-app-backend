import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UnitVocabularySetService } from './unit-vocabulary-set.service.js';
import { UnitVocabularySetController } from './unit-vocabulary-set.controller.js';
import { UnitVocabularySet } from './entities/unit_vocabulary_set.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([UnitVocabularySet])],
  controllers: [UnitVocabularySetController],
  providers: [UnitVocabularySetService],
  exports: [UnitVocabularySetService],
})
export class UnitVocabularySetModule {}
