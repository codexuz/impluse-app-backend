import { PartialType } from "@nestjs/swagger";
import { CreateSubQuestionDto } from "./create-multiple-choice-question.dto.js";

export class UpdateSubQuestionDto extends PartialType(CreateSubQuestionDto) {}
