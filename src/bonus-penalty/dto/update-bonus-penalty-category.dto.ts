import { PartialType } from "@nestjs/swagger";
import { CreateBonusPenaltyCategoryDto } from "./create-bonus-penalty-category.dto.js";

export class UpdateBonusPenaltyCategoryDto extends PartialType(
  CreateBonusPenaltyCategoryDto,
) {}
