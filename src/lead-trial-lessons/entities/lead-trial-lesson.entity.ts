import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { Lead } from "../../leads/entities/lead.entity.js";

@Table({
  tableName: "lead_trial_lessons",
  timestamps: true,
  paranoid: true, // This enables soft delete`
})
export class LeadTrialLesson extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.DATE)
  scheduledAt!: Date;

  @Column({
    type: DataType.ENUM("belgilangan", "keldi", "kelmadi"),
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  @BelongsTo(() => User, {
    foreignKey: "teacher_id",
    targetKey: "user_id",
    as: "teacherInfo",
  })
  teacherInfo: User;

  @ForeignKey(() => Lead)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  lead_id: string;

  @BelongsTo(() => Lead, {
    foreignKey: "lead_id",
    targetKey: "id",
    as: "leadInfo",
  })
  leadInfo: Lead;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  notes: string;
}
