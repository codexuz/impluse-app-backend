import { Table, Column, Model, DataType } from "sequelize-typescript";

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

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  lead_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  notes: string;
}
