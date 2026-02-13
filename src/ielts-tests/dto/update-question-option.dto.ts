import { PartialType } from "@nestjs/swagger";
import { CreateQuestionOptionDto } from "./create-question-option.dto.js";

export class UpdateQuestionOptionDto extends PartialType(
  CreateQuestionOptionDto,
) {}
