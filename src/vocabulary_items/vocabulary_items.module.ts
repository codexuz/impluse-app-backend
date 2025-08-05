import { Module } from '@nestjs/common';
import { VocabularyItemsService } from './vocabulary_items.service.js';
import { VocabularyItemsController } from './vocabulary_items.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { VocabularyItem } from './entities/vocabulary_item.entity.js';
@Module({
   imports: [
    SequelizeModule.forFeature([VocabularyItem]),
  ],
  controllers: [VocabularyItemsController],
  providers: [VocabularyItemsService],
  exports: [VocabularyItemsService, SequelizeModule],

})
export class VocabularyItemsModule {}
