import { PartialType } from "@nestjs/swagger";
import { CreateIeltsDeckWordDto } from "./create-ielts-deck-word.dto.js";

export class UpdateIeltsDeckWordDto extends PartialType(
  CreateIeltsDeckWordDto,
) {}
