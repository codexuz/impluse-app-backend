import { PartialType } from "@nestjs/swagger";
import { CreateBonusPenaltyTransactionDto } from "./create-bonus-penalty-transaction.dto.js";

export class UpdateBonusPenaltyTransactionDto extends PartialType(
  CreateBonusPenaltyTransactionDto,
) {}
