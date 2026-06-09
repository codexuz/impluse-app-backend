import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "shop_items",
  timestamps: true,
})
export class ShopItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image_url?: string;

  // Price in coins.
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price!: number;

  // Available stock. null means unlimited.
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  stock?: number;

  // When false the item is hidden from students and cannot be purchased.
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
