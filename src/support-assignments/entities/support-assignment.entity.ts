import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { DaysEnum } from "../../groups/entities/group.entity.js";

@Table({
  tableName: "support_assignments",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SupportAssignment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  support_teacher_id!: string; // FK to User where role = 'support_teacher'

  @Column({ type: DataType.UUID, allowNull: true })
  teacher_id!: string; // FK to User (the group's main teacher)

  @Column({ type: DataType.UUID, allowNull: false })
  group_id!: string; // FK to Group

  @Column({
    type: DataType.ENUM("odd", "even", "every_day", "other_day"),
    allowNull: true,
  })
  days!: DaysEnum;

  @Column({ type: DataType.TIME, allowNull: true })
  start_time!: string; // Format: HH:MM (e.g., "14:00")

  @Column({ type: DataType.TIME, allowNull: true })
  end_time!: string; // Format: HH:MM (e.g., "15:30")

  @Column({ type: DataType.DATEONLY, allowNull: true })
  start_date!: string; // Active from (optional)

  @Column({ type: DataType.DATEONLY, allowNull: true })
  end_date!: string; // Active until (optional)

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active!: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
