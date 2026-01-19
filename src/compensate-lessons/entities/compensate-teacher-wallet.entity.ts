import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "compensate_teacher_wallet",
  timestamps: false,
})
export class CompensateTeacherWallet extends Model<CompensateTeacherWallet> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  compensate_lesson_id: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  amount: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paid_at: Date;
}
