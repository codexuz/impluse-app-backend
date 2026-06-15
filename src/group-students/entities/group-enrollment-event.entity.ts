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
import { Group } from "../../groups/entities/group.entity.js";

export enum EnrollmentEventType {
  JOINED = "joined",
  LEFT = "left",
  TRANSFERRED_IN = "transferred_in",
  TRANSFERRED_OUT = "transferred_out",
}

/**
 * Append-only history of group membership changes.
 *
 * The `group_students` table only keeps the *current* state of a membership
 * (it is mutated in place when a student is removed / transferred), which makes
 * it impossible to reconstruct who was in a group at a point in the past.
 *
 * This log records every join/leave so that monthly retention — how many
 * students who were active at the start of a month are still active at the end —
 * can be computed per teacher / group / branch.
 *
 * `teacher_id` and `branch_id` are denormalised snapshots of the group at the
 * moment of the event, so stats stay correct even if a group later changes
 * teacher or branch.
 */
@Table({
  tableName: "group_enrollment_events",
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ["group_id"] },
    { fields: ["student_id"] },
    { fields: ["teacher_id", "occurred_at"] },
    { fields: ["occurred_at"] },
  ],
})
export class GroupEnrollmentEvent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string;

  @BelongsTo(() => User, "student_id")
  student: User;

  // Snapshot of the group's teacher at the time of the event (nullable: a group
  // may have no teacher assigned).
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  teacher_id: string;

  // Snapshot of the group's branch at the time of the event.
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string;

  @Column({
    type: DataType.ENUM(
      "joined",
      "left",
      "transferred_in",
      "transferred_out",
    ),
    allowNull: false,
  })
  event_type: EnrollmentEventType;

  // The status the membership moved to (for 'left' events: removed / completed),
  // kept for auditing. Free-form so it stays in sync with the membership enum.
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  occurred_at: Date;

  @CreatedAt
  createdAt: Date;
}
