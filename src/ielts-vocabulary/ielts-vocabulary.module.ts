import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { IeltsVocabularyService } from "./ielts-vocabulary.service.js";
import { IeltsVocabularyController } from "./ielts-vocabulary.controller.js";
import { IeltsVocabulary } from "./entities/ielts-vocabulary.entity.js";
import { IeltsVocabularyDeck } from "./entities/ielts-vocabulary-deck.entity.js";
import { IeltsDeckWord } from "./entities/ielts-deck-word.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      IeltsVocabulary,
      IeltsVocabularyDeck,
      IeltsDeckWord,
    ]),
  ],
  controllers: [IeltsVocabularyController],
  providers: [IeltsVocabularyService],
  exports: [IeltsVocabularyService, SequelizeModule],
})
export class IeltsVocabularyModule {}
