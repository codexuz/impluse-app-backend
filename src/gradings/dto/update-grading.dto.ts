import { PartialType } from "@nestjs/swagger";
import { CreateGradingDto } from "./create-grading.dto.js";

export class UpdateGradingDto extends PartialType(CreateGradingDto) {}
