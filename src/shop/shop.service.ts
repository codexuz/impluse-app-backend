import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { Transaction } from "sequelize";
import { ShopItem } from "./entities/shop-item.entity.js";
import {
  ShopPurchase,
  PurchaseStatus,
} from "./entities/shop-purchase.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { CreateShopItemDto } from "./dto/create-shop-item.dto.js";
import { UpdateShopItemDto } from "./dto/update-shop-item.dto.js";
import { CreatePurchaseDto } from "./dto/create-purchase.dto.js";
import { ReviewPurchaseDto } from "./dto/review-purchase.dto.js";
import { ExchangeDto, ExchangeFrom } from "./dto/exchange.dto.js";

// Value of one coin expressed in each lower-tier currency.
// Coins are the highest value, then streaks, then points.
// 1 coin = 10 streaks = 100 points (so 1 streak = 10 points).
const COINS_PER = {
  [ExchangeFrom.STREAKS]: 10,
  [ExchangeFrom.POINTS]: 100,
};

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopItem)
    private shopItemModel: typeof ShopItem,
    @InjectModel(ShopPurchase)
    private shopPurchaseModel: typeof ShopPurchase,
    @InjectModel(StudentProfile)
    private studentProfileModel: typeof StudentProfile,
    private sequelize: Sequelize
  ) {}

  // ---- Shop items (admin-managed catalog) ----

  createItem(dto: CreateShopItemDto): Promise<ShopItem> {
    return this.shopItemModel.create({ ...dto });
  }

  /**
   * List items. Students only see active items; admins can pass
   * includeInactive to see the full catalog.
   */
  findAllItems(includeInactive = false): Promise<ShopItem[]> {
    return this.shopItemModel.findAll({
      where: includeInactive ? {} : { is_active: true },
      order: [["createdAt", "DESC"]],
    });
  }

  async findItem(id: string): Promise<ShopItem> {
    const item = await this.shopItemModel.findByPk(id);
    if (!item) {
      throw new NotFoundException(`Shop item with ID ${id} not found`);
    }
    return item;
  }

  async updateItem(id: string, dto: UpdateShopItemDto): Promise<ShopItem> {
    const item = await this.findItem(id);
    await item.update(dto);
    return item;
  }

  async removeItem(id: string): Promise<void> {
    const item = await this.findItem(id);
    await item.destroy();
  }

  // ---- Purchases ----

  /**
   * Student buys an item. Coins are deducted immediately and the request is
   * created in PENDING state for an admin to fulfil. Charging coins and
   * decrementing stock happen in one transaction so a student can never spend
   * coins without a recorded request.
   */
  async purchase(
    userId: string,
    dto: CreatePurchaseDto
  ): Promise<ShopPurchase> {
    const quantity = dto.quantity ?? 1;

    return this.sequelize.transaction(async (t) => {
      const item = await this.shopItemModel.findByPk(dto.item_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!item) {
        throw new NotFoundException(
          `Shop item with ID ${dto.item_id} not found`
        );
      }
      if (!item.is_active) {
        throw new BadRequestException("This item is not available for purchase");
      }
      if (item.stock !== null && item.stock !== undefined && item.stock < quantity) {
        throw new BadRequestException(
          `Insufficient stock: ${item.stock} available, ${quantity} requested`
        );
      }

      const totalPrice = item.price * quantity;
      const profile = await this.lockProfile(userId, t);
      if (profile.coins < totalPrice) {
        throw new BadRequestException(
          `Insufficient coins: ${profile.coins} available, ${totalPrice} required`
        );
      }

      await profile.decrement("coins", { by: totalPrice, transaction: t });

      if (item.stock !== null && item.stock !== undefined) {
        await item.decrement("stock", { by: quantity, transaction: t });
      }

      return this.shopPurchaseModel.create(
        {
          user_id: userId,
          item_id: item.id,
          quantity,
          total_price: totalPrice,
          status: PurchaseStatus.PENDING,
        },
        { transaction: t }
      );
    });
  }

  // All purchase requests (admin view), newest first.
  findAllPurchases(status?: PurchaseStatus): Promise<ShopPurchase[]> {
    return this.shopPurchaseModel.findAll({
      where: status ? { status } : {},
      order: [["createdAt", "DESC"]],
      include: [
        { association: "item" },
        {
          association: "user",
          attributes: ["user_id", "first_name", "last_name", "username", "avatar_url"],
        },
      ],
    });
  }

  // A single student's purchase history.
  findPurchasesByUser(userId: string): Promise<ShopPurchase[]> {
    return this.shopPurchaseModel.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      include: [{ association: "item" }],
    });
  }

  async findPurchase(id: string): Promise<ShopPurchase> {
    const purchase = await this.shopPurchaseModel.findByPk(id, {
      include: [{ association: "item" }],
    });
    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return purchase;
  }

  /**
   * Admin reviews a pending request. Approving or delivering simply records the
   * decision (coins were already charged at purchase time). Rejecting refunds
   * the coins and restocks the item, in one transaction.
   */
  async reviewPurchase(
    id: string,
    adminId: string,
    dto: ReviewPurchaseDto
  ): Promise<ShopPurchase> {
    return this.sequelize.transaction(async (t) => {
      const purchase = await this.shopPurchaseModel.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!purchase) {
        throw new NotFoundException(`Purchase with ID ${id} not found`);
      }

      if (
        purchase.status === PurchaseStatus.REJECTED ||
        purchase.status === PurchaseStatus.DELIVERED
      ) {
        throw new BadRequestException(
          `Purchase is already ${purchase.status} and cannot be changed`
        );
      }

      if (dto.status === PurchaseStatus.REJECTED) {
        // Refund coins and restore stock.
        const profile = await this.lockProfile(purchase.user_id, t);
        await profile.increment("coins", {
          by: purchase.total_price,
          transaction: t,
        });

        const item = await this.shopItemModel.findByPk(purchase.item_id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        if (item && item.stock !== null && item.stock !== undefined) {
          await item.increment("stock", {
            by: purchase.quantity,
            transaction: t,
          });
        }
      }

      purchase.status = dto.status;
      purchase.reviewed_by = adminId;
      if (dto.admin_note !== undefined) {
        purchase.admin_note = dto.admin_note;
      }
      await purchase.save({ transaction: t });
      return purchase;
    });
  }

  // ---- Coin exchange ----

  /**
   * Convert points or streaks into coins. Coins are the highest-value currency,
   * so only upward conversion (points/streaks -> coins) is supported; coins are
   * spent in the shop and never converted back. The spent amount must be a whole
   * multiple of the rate (100 points or 10 streaks per coin).
   */
  async exchangeToCoins(
    userId: string,
    dto: ExchangeDto
  ): Promise<StudentProfile> {
    const rate = COINS_PER[dto.from];
    if (dto.amount % rate !== 0) {
      throw new BadRequestException(
        `Amount must be a multiple of ${rate} ${dto.from} (1 coin = ${rate} ${dto.from})`
      );
    }
    const coinsGained = dto.amount / rate;

    return this.sequelize.transaction(async (t) => {
      const profile = await this.lockProfile(userId, t);
      const balance =
        dto.from === ExchangeFrom.POINTS ? profile.points : profile.streaks;
      if (balance < dto.amount) {
        throw new BadRequestException(
          `Insufficient ${dto.from}: ${balance} available, ${dto.amount} required`
        );
      }

      await profile.decrement(dto.from, { by: dto.amount, transaction: t });
      await profile.increment("coins", { by: coinsGained, transaction: t });
      return profile.reload({ transaction: t });
    });
  }

  private async lockProfile(
    userId: string,
    t: Transaction
  ): Promise<StudentProfile> {
    const profile = await this.studentProfileModel.findOne({
      where: { user_id: userId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!profile) {
      throw new NotFoundException(
        `Student profile for user ${userId} not found`
      );
    }
    return profile;
  }
}
