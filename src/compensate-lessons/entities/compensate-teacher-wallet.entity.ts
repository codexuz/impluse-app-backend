import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { CompensateLesson } from "./compensate-lesson.entity.js";

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  @BelongsTo(() => User, "teacher_id")
  teacher: User;

  @ForeignKey(() => CompensateLesson)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  compensate_lesson_id: string;

  @BelongsTo(() => CompensateLesson, "compensate_lesson_id")
  compensateLesson: CompensateLesson;

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
