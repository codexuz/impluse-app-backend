import { PartialType } from "@nestjs/swagger";
import { CreateIeltsVocabularyDeckDto } from "./create-ielts-vocabulary-deck.dto.js";

export class UpdateIeltsVocabularyDeckDto extends PartialType(
  CreateIeltsVocabularyDeckDto,
) {}
