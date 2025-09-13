import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "student_payments",
  timestamps: true,
})
export class StudentPayment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  student_id!: string;

  @Column(DataType.UUID)
  manager_id!: string;

  @Column({
    type: DataType.INTEGER,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM("pending", "completed", "failed"),
  })
  status!: string;

  @Column({
    type: DataType.ENUM("Naqd", "Karta", "Click", "Payme"),
  })
  payment_method!: string;

  @Column({
    type: DataType.DATEONLY,
  })
  payment_date!: Date;

  @Column({
    type: DataType.DATEONLY,
  })
  next_payment_date!: Date;

  @Column({
    type: DataType.TEXT,
  })
  notes!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
