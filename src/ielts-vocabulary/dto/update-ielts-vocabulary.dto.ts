import { PartialType } from "@nestjs/swagger";
import { CreateIeltsVocabularyDto } from "./create-ielts-vocabulary.dto.js";

export class UpdateIeltsVocabularyDto extends PartialType(
  CreateIeltsVocabularyDto,
) {}
