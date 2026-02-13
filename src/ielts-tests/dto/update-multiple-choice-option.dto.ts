import { PartialType } from "@nestjs/swagger";
import { CreateMultipleChoiceOptionDto } from "./create-multiple-choice-option.dto.js";

export class UpdateMultipleChoiceOptionDto extends PartialType(
  CreateMultipleChoiceOptionDto,
) {}
