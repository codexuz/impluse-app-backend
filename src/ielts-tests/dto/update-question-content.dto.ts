import { PartialType } from "@nestjs/swagger";
import { CreateQuestionContentDto } from "./create-question-content.dto.js";

export class UpdateQuestionContentDto extends PartialType(
  CreateQuestionContentDto,
) {}
