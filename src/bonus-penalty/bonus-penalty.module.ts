import { Module, OnModuleInit } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BonusPenaltyWalletService } from "./bonus-penalty-wallet.service.js";
import { BonusPenaltyWalletController } from "./bonus-penalty-wallet.controller.js";
import { BonusPenaltyTransactionService } from "./bonus-penalty-transaction.service.js";
import { BonusPenaltyTransactionController } from "./bonus-penalty-transaction.controller.js";
import { BonusPenaltyCategoryService } from "./bonus-penalty-category.service.js";
import { BonusPenaltyCategoryController } from "./bonus-penalty-category.controller.js";
import { BonusPenaltyWallet } from "./entities/bonus-penalty-wallet.entity.js";
import { BonusPenaltyTransaction } from "./entities/bonus-penalty-transaction.entity.js";
import { BonusPenaltyCategory } from "./entities/bonus-penalty-category.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { User } from "../users/entities/user.entity.js";
import { Role } from "../users/entities/role.model.js";
import { UserRole } from "../users/entities/user-role.model.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      BonusPenaltyWallet,
      BonusPenaltyTransaction,
      BonusPenaltyCategory,
      GroupStudent,
      Group,
      User,
      Role,
      UserRole,
    ]),
  ],
  controllers: [
    BonusPenaltyWalletController,
    BonusPenaltyTransactionController,
    BonusPenaltyCategoryController,
  ],
  providers: [
    BonusPenaltyWalletService,
    BonusPenaltyTransactionService,
    BonusPenaltyCategoryService,
  ],
  exports: [
    BonusPenaltyWalletService,
    BonusPenaltyTransactionService,
    BonusPenaltyCategoryService,
  ],
})
export class BonusPenaltyModule implements OnModuleInit {
  constructor(
    private readonly bonusPenaltyWalletService: BonusPenaltyWalletService,
  ) {}

  // Backfill wallets for all existing admin/teacher/support_teacher users on
  // startup. Idempotent — only missing wallets are created.
  async onModuleInit() {
    try {
      await this.bonusPenaltyWalletService.seedWalletsForStaffRoles();
    } catch (error: any) {
      // Never block app startup on the backfill.
      console.error(
        `Failed to seed bonus & penalty wallets: ${error.message}`,
      );
    }
  }
}
