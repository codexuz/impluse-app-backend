import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  Index,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { IeltsTest } from "./ielts-test.entity.js";
import { IeltsReading } from "./ielts-reading.entity.js";
import { IeltsListening } from "./ielts-listening.entity.js";
import { IeltsWriting } from "./ielts-writing.entity.js";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";
import { IeltsWritingTask } from "./ielts-writing-task.entity.js";

export enum AttemptScope {
  TEST = "TEST",
  MODULE = "MODULE",
  PART = "PART",
  TASK = "TASK",
}

export enum AttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  ABANDONED = "ABANDONED",
}

@Table({
  tableName: "ielts_answer_attempts",
  timestamps: true,
  indexes: [
    {
      fields: ["user_id", "started_at"],
    },
  ],
})
export class IeltsAnswerAttempt extends Model<IeltsAnswerAttempt> {
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

  @Column({
    type: DataType.ENUM(...Object.values(AttemptScope)),
    allowNull: false,
  })
  scope: AttemptScope;

  @ForeignKey(() => IeltsTest)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  test_id: string;

  @ForeignKey(() => IeltsReading)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  module_id: string;

  @ForeignKey(() => IeltsReadingPart)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  part_id: string;

  @ForeignKey(() => IeltsWritingTask)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  task_id: string;

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
    type: DataType.ENUM(...Object.values(AttemptStatus)),
    defaultValue: AttemptStatus.IN_PROGRESS,
  })
  status: AttemptStatus;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
