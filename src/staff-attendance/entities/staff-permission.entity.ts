import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";

/**
 * A staff "ruxsat" (permission/leave) request.
 *
 *  - full_day     → excused absence; staff is not expected to come at all.
 *  - late_arrival → permitted to arrive late; `permitted_time` (HH:mm) is the
 *                   latest excused arrival time. Lateness/fines are computed
 *                   from this time instead of the shift start.
 *  - early_leave  → permitted to leave early; `permitted_time` is the earliest
 *                   excused checkout time.
 *
 * Only rows with status = "approved" affect attendance scanning and the
 * auto-absent cron. The date window is inclusive: [start_date, end_date].
 */
@Table({
  tableName: "staff_permissions",
  timestamps: true,
})
export class StaffPermission extends Model {
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

  staff: User;

  @Column({
    type: DataType.ENUM("full_day", "late_arrival", "early_leave"),
    allowNull: false,
  })
  type: "full_day" | "late_arrival" | "early_leave";

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: "First day the permission applies (inclusive)",
  })
  start_date: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: "Last day the permission applies (inclusive). Equals start_date for a single day",
  })
  end_date: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "HH:mm — excused arrival (late_arrival) or excused checkout (early_leave)",
  })
  permitted_time: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  reason: string | null;

  @Column({
    type: DataType.ENUM("pending", "approved", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  })
  status: "pending" | "approved" | "rejected";

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: "Who created the request (staff or admin)",
  })
  requested_by: string | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: "Admin who approved/rejected",
  })
  reviewed_by: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  reviewed_at: Date | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "Admin note on approval/rejection",
  })
  review_note: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
