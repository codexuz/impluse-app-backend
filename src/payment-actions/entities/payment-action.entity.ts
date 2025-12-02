import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";
import { StudentPayment } from "../../student-payment/entities/student-payment.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "payment_actions",
  timestamps: true,
})
export class PaymentAction extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => StudentPayment)
  @Column(DataType.UUID)
  payment_id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  manager_id!: string;

  @Column({
    type: DataType.ENUM("upcoming", "debitor"),
  })
  stage!: string;

  @Column({
    type: DataType.ENUM("sms", "phone", "in_person"),
  })
  action_type!: string;

  @Column({
    type: DataType.TEXT,
  })
  message!: string;

  @Column({
    type: DataType.DATEONLY,
  })
  next_action_date!: Date;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  // Association properties (defined in models/index.ts)
  declare payment?: StudentPayment;
  declare manager?: User;
}
