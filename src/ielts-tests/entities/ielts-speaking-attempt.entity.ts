import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { IeltsSpeaking } from "./ielts-speaking.entity.js";

export enum SpeakingAttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

/**
 * A record of one real-time AI speaking session. Stores the running
 * transcript (both examiner and candidate turns) and, optionally, an AI
 * band-score feedback summary produced at the end of the session.
 */
@Table({
  tableName: "ielts_speaking_attempts",
  timestamps: true,
  indexes: [{ fields: ["user_id", "started_at"] }],
})
export class IeltsSpeakingAttempt extends Model<IeltsSpeakingAttempt> {
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
  user_id: string;

  @ForeignKey(() => IeltsSpeaking)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  speaking_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(SpeakingAttemptStatus)),
    allowNull: false,
    defaultValue: SpeakingAttemptStatus.IN_PROGRESS,
  })
  status: SpeakingAttemptStatus;

  // Ordered turn-by-turn transcript: [{ role: "examiner"|"candidate", text, at }]
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  transcript: Array<{ role: "examiner" | "candidate"; text: string; at: string }>;

  // Optional AI feedback summary (band estimate + notes) generated at the end.
  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  feedback: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  started_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  finished_at: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  duration_seconds: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
