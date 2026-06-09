import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  Index,
} from "sequelize-typescript";

/**
 * Append-only ledger of points awarded to a student. The StudentProfile only
 * tracks the lifetime total, so this log is what makes time-windowed
 * leaderboards (e.g. the weekly level leaderboard) possible.
 *
 * A row is written every time points are added; the weekly leaderboard sums
 * the rows whose createdAt falls in the current week.
 */
@Table({
  tableName: "points_logs",
  timestamps: true,
  updatedAt: false,
})
export class PointsLog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Index("points_logs_user_id_created_at")
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  // Denormalized at write time so weekly-by-level queries don't need to join
  // through users (a student's level rarely changes mid-week).
  @Index("points_logs_level_id_created_at")
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  level_id?: string | null;

  // Points earned in this single award. Can be negative if points are revoked.
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  points!: number;

  @CreatedAt
  createdAt!: Date;
}
