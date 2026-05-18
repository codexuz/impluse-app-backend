import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export type CallKind = "p2p" | "ai";
export type CallStatus =
  | "ringing"
  | "ongoing"
  | "completed"
  | "missed"
  | "rejected"
  | "failed"
  | "cancelled";

@Table({
  tableName: "call_logs",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CallLog extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.ENUM("p2p", "ai"),
    allowNull: false,
  })
  kind: CallKind;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  caller_id: string;

  // Null for AI calls (the callee is the AI agent)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  callee_id: string | null;

  @Column({
    type: DataType.ENUM(
      "ringing",
      "ongoing",
      "completed",
      "missed",
      "rejected",
      "failed",
      "cancelled",
    ),
    allowNull: false,
    defaultValue: "ringing",
  })
  status: CallStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  started_at: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  ended_at: Date | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  duration_seconds: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  end_reason: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
