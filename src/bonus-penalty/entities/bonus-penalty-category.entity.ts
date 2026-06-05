import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({
  tableName: "bonus_penalty_categories",
  timestamps: true,
  paranoid: true, // This enables soft delete
})
export class BonusPenaltyCategory extends Model<BonusPenaltyCategory> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  // Optional scope: which kind of transaction this category applies to.
  // Null means it can be used for any type.
  @Column({
    type: DataType.ENUM("bonus", "jarima", "referal"),
    allowNull: true,
  })
  type: "bonus" | "jarima" | "referal";

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
