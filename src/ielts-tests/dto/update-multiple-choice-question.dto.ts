import { PartialType } from "@nestjs/swagger";
import { CreateMultipleChoiceQuestionDto } from "./create-multiple-choice-question.dto.js";

export class UpdateMultipleChoiceQuestionDto extends PartialType(
  CreateMultipleChoiceQuestionDto,
) {}
