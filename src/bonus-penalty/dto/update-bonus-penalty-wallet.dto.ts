import { PartialType } from "@nestjs/swagger";
import { CreateBonusPenaltyWalletDto } from "./create-bonus-penalty-wallet.dto.js";

export class UpdateBonusPenaltyWalletDto extends PartialType(
  CreateBonusPenaltyWalletDto,
) {}
