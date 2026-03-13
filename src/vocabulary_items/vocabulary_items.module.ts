import { Module } from '@nestjs/common';
import { VocabularyItemsService } from './vocabulary_items.service.js';
import { VocabularyItemsController } from './vocabulary_items.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { VocabularyItem } from './entities/vocabulary_item.entity.js';
import { StudentVocabularyProgressModule } from '../student_vocabulary_progress/student-vocabulary-progress.module.js';

@Module({
   imports: [
    SequelizeModule.forFeature([VocabularyItem]),
    StudentVocabularyProgressModule,
  ],
  controllers: [VocabularyItemsController],
  providers: [VocabularyItemsService],
  exports: [VocabularyItemsService, SequelizeModule],

})
export class VocabularyItemsModule {}
