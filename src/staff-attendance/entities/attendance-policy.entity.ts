import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "attendance_policies",
  timestamps: true,
})
export class AttendancePolicy extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: "null = global default",
  })
  branch_id: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "null = all roles",
  })
  role: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Minutes after shift start before lateness is counted",
  })
  grace_period_minutes: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100000,
    comment: "Fine amount (coins) when late <= threshold_minutes",
  })
  fine_tier1_amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
    comment: "Minutes-late boundary between tier1 and tier2 fine",
  })
  fine_tier1_max_minutes: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 200000,
    comment: "Fine amount (coins) when late > threshold_minutes",
  })
  fine_tier2_amount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Maximum fine per day (0 = no cap)",
  })
  max_fine_per_day: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  effective_from: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  effective_to: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
