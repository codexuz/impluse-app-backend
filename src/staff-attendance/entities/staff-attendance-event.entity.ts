import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from "sequelize-typescript";

/**
 * Immutable audit log — one row per scan attempt, regardless of outcome.
 * attendance_id is null when the scan failed validation.
 */
@Table({
  tableName: "staff_attendance_events",
  timestamps: false,
  updatedAt: false,
})
export class StaffAttendanceEvent extends Model {
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
  staff_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: "FK to staff_attendances — null if the scan was rejected",
  })
  attendance_id: string | null;

  @Column({
    type: DataType.ENUM("qr_scan", "auto_scan", "manual", "cron_absent"),
    allowNull: false,
  })
  method: "qr_scan" | "auto_scan" | "manual" | "cron_absent";

  @Column({
    type: DataType.ENUM("in", "out", "absent"),
    allowNull: false,
  })
  type: "in" | "out" | "absent";

  @Column({
    type: DataType.ENUM("success", "rejected"),
    allowNull: false,
    defaultValue: "success",
  })
  outcome: "success" | "rejected";

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "Rejection reason or additional context",
  })
  note: string | null;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: "Raw payload from the scan (QR data, bot payload, etc.)",
  })
  raw_payload: object | null;

  @CreatedAt
  createdAt: Date;
}
