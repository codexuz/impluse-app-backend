import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user.entity.js";

@Table({
  tableName: "sms_verifications",
  timestamps: true,
})
export class SmsVerification extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  attempts: number;

  @BelongsTo(() => User)
  user: User;
}
