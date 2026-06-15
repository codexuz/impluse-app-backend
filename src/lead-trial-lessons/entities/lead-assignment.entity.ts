import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { Lead } from "../../leads/entities/lead.entity.js";

/**
 * Conversion outcome of a lead assignment from the assigned teacher's
 * perspective. This is independent of attendance (tracked separately via the
 * `attended` flag), so an attended lead that later enrolled is both
 * `attended = true` and `outcome = became_student`.
 *
 *  - pending          : assigned, not yet converted or lost
 *  - became_student   : lead enrolled (credited to this teacher)
 *  - lost             : lead was lost
 */
export enum LeadAssignmentOutcome {
  PENDING = "pending",
  BECAME_STUDENT = "became_student",
  LOST = "lost",
}

/**
 * One row per (teacher, lead) assignment.
 *
 * Previously "which leads were assigned to a teacher" was inferred from the
 * `lead_trial_lessons` table, but a lead can have several trial lessons (reschedules,
 * second trials), which double-counted leads in the per-teacher statistics and
 * made conversion rates wrong. This table records the assignment once per
 * teacher+lead and tracks the latest outcome, so stats are clean and there is a
 * single source of truth for "assigned leads".
 *
 * `branch_id` is a denormalised snapshot from the lead at assignment time so
 * branch-scoped reporting stays correct even if the lead is later moved.
 */
@Table({
  tableName: "lead_assignments",
  timestamps: true,
  indexes: [
    // One assignment per teacher+lead.
    { unique: true, fields: ["teacher_id", "lead_id"] },
    { fields: ["teacher_id", "assigned_at"] },
    { fields: ["lead_id"] },
    { fields: ["outcome"] },
  ],
})
export class LeadAssignment extends Model {
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

  // Snapshot of the lead's branch at assignment time.
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string;

  @Column({
    type: DataType.ENUM("pending", "became_student", "lost"),
    allowNull: false,
    defaultValue: LeadAssignmentOutcome.PENDING,
  })
  outcome: LeadAssignmentOutcome;

  // Whether the lead showed up to at least one of this teacher's trial lessons.
  // Tracked independently of `outcome` so conversion can be measured among
  // attended leads.
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  attended: boolean;

  // When the lead was first assigned to this teacher (first trial's scheduledAt,
  // falling back to assignment creation time).
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  assigned_at: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
