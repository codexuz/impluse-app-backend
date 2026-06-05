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
  tableName: "bonus_penalty_transactions",
  timestamps: true,
  paranoid: true, // This enables soft delete
})
export class BonusPenaltyTransaction extends Model<BonusPenaltyTransaction> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  // Teacher who receives the bonus/referral or is fined (jarima)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  // For "referal": the student whose referral triggered the payment
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  student_id: string;

  // For "referal": the lead that was referred
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lead_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string;

  // Optional classification of the transaction.
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  category_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.ENUM("bonus", "jarima", "referal"),
    allowNull: false,
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
