import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"
  | "every_day"
  | "odd"   // Mon / Wed / Fri
  | "even"; // Tue / Thu / Sat

@Table({
  tableName: "staff_shifts",
  timestamps: true,
})
export class StaffShift extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: "FK to staff_profiles.id",
  })
  profile_id: string;

  @Column({
    type: DataType.ENUM(
      "monday", "tuesday", "wednesday", "thursday",
      "friday", "saturday", "sunday", "every_day", "odd", "even",
    ),
    allowNull: false,
    defaultValue: "every_day",
  })
  day_of_week: DayOfWeek;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    comment: "Shift start — expected check-in time (HH:MM:SS)",
  })
  in_time: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
    comment: "Shift end — expected check-out time (HH:MM:SS)",
  })
  out_time: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Minutes of tolerance before lateness is counted for this shift",
  })
  grace_period_minutes: number;

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
