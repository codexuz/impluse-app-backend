import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateBonusPenaltyWalletDto } from "./dto/create-bonus-penalty-wallet.dto.js";
import { UpdateBonusPenaltyWalletDto } from "./dto/update-bonus-penalty-wallet.dto.js";
import { UpdateWalletAmountDto } from "./dto/update-wallet-amount.dto.js";
import { BonusPenaltyWallet } from "./entities/bonus-penalty-wallet.entity.js";
import { Role } from "../users/entities/role.model.js";
import { UserRole } from "../users/entities/user-role.model.js";

// Roles that should always own a bonus & penalty wallet.
export const WALLET_ROLES = ["admin", "teacher", "support_teacher"];

@Injectable()
export class BonusPenaltyWalletService {
  private readonly logger = new Logger(BonusPenaltyWalletService.name);

  constructor(
    @InjectModel(BonusPenaltyWallet)
    private bonusPenaltyWalletModel: typeof BonusPenaltyWallet,
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(UserRole)
    private userRoleModel: typeof UserRole,
  ) {}

  /**
   * Ensure every user holding one of WALLET_ROLES has a wallet. Idempotent and
   * association-free (queries the join table directly) so it is safe to run at
   * any bootstrap order. Returns the number of wallets created.
   */
  async seedWalletsForStaffRoles(
    roleNames: string[] = WALLET_ROLES,
  ): Promise<number> {
    const roles = await this.roleModel.findAll({
      where: { name: roleNames },
      attributes: ["id"],
    });
    const roleIds = roles.map((r) => r.id);
    if (roleIds.length === 0) return 0;

    const userRoles = await this.userRoleModel.findAll({
      where: { roleId: roleIds },
      attributes: ["userId"],
    });
    const userIds = [...new Set(userRoles.map((ur) => ur.userId))];
    if (userIds.length === 0) return 0;

    const existing = await this.bonusPenaltyWalletModel.findAll({
      where: { teacher_id: userIds },
      attributes: ["teacher_id"],
      paranoid: false, // don't recreate a soft-deleted wallet
    });
    const have = new Set(existing.map((w) => w.teacher_id));
    const missing = userIds.filter((id) => !have.has(id));

    if (missing.length > 0) {
      await this.bonusPenaltyWalletModel.bulkCreate(
        missing.map((id) => ({ teacher_id: id, amount: 0 })) as any,
      );
      this.logger.log(
        `Seeded ${missing.length} bonus & penalty wallet(s) for staff roles`,
      );
    }

    return missing.length;
  }

  async create(
    createBonusPenaltyWalletDto: CreateBonusPenaltyWalletDto,
  ): Promise<BonusPenaltyWallet> {
    const existingWallet = await this.bonusPenaltyWalletModel.findOne({
      where: { teacher_id: createBonusPenaltyWalletDto.teacher_id },
    });

    if (existingWallet) {
      throw new ConflictException(
        "Bonus & penalty wallet already exists for this teacher",
      );
    }

    return await this.bonusPenaltyWalletModel.create({
      teacher_id: createBonusPenaltyWalletDto.teacher_id,
      amount: createBonusPenaltyWalletDto.amount ?? 0,
    } as any);
  }

  async findAll(): Promise<BonusPenaltyWallet[]> {
    return await this.bonusPenaltyWalletModel.findAll({
      order: [["created_at", "DESC"]],
    });
  }

  async findByTeacherId(teacherId: string): Promise<BonusPenaltyWallet> {
    const wallet = await this.bonusPenaltyWalletModel.findOne({
      where: { teacher_id: teacherId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `Bonus & penalty wallet for teacher with ID "${teacherId}" not found`,
      );
    }

    return wallet;
  }

  async findOne(id: string): Promise<BonusPenaltyWallet> {
    const wallet = await this.bonusPenaltyWalletModel.findByPk(id);

    if (!wallet) {
      throw new NotFoundException(
        `Bonus & penalty wallet with ID "${id}" not found`,
      );
    }

    return wallet;
  }

  async update(
    id: string,
    updateBonusPenaltyWalletDto: UpdateBonusPenaltyWalletDto,
  ): Promise<BonusPenaltyWallet> {
    const wallet = await this.findOne(id);

    await wallet.update(updateBonusPenaltyWalletDto as any);

    return wallet;
  }

  async updateAmount(
    id: string,
    updateWalletAmountDto: UpdateWalletAmountDto,
  ): Promise<BonusPenaltyWallet> {
    const wallet = await this.findOne(id);

    const newAmount = wallet.amount + updateWalletAmountDto.amount;

    await wallet.update({ amount: newAmount });

    return wallet;
  }

  async findOrCreate(teacherId: string): Promise<BonusPenaltyWallet> {
    const [wallet] = await this.bonusPenaltyWalletModel.findOrCreate({
      where: { teacher_id: teacherId },
      defaults: {
        teacher_id: teacherId,
        amount: 0,
      } as any,
    });
    return wallet;
  }

  async remove(id: string): Promise<void> {
    const wallet = await this.findOne(id);

    await wallet.destroy(); // Soft delete since paranoid is enabled
  }
}
