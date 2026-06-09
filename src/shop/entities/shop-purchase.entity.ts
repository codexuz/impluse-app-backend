import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export enum PurchaseStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELIVERED = "delivered",
}

@Table({
  tableName: "shop_purchases",
  timestamps: true,
})
export class ShopPurchase extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  item_id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  quantity!: number;

  // Total coins charged at the time of purchase (price * quantity).
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_price!: number;

  @Column({
    type: DataType.ENUM(...Object.values(PurchaseStatus)),
    allowNull: false,
    defaultValue: PurchaseStatus.PENDING,
  })
  status!: PurchaseStatus;

  // Admin who reviewed (approved/rejected/delivered) the request.
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  reviewed_by?: string;

  // Optional note from the admin (e.g. rejection reason, delivery details).
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  admin_note?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
