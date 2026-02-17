import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsAnswerAttempt } from "./ielts-answer-attempt.entity.js";
import { IeltsWritingTask } from "./ielts-writing-task.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "ielts_writing_answers",
  timestamps: true,
})
export class IeltsWritingAnswer extends Model<IeltsWritingAnswer> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsAnswerAttempt)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attempt_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => IeltsWritingTask)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  task_id: string;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  answer_text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  word_count: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  score: {
    task_response: number | null;
    lexical_resources: number | null;
    grammar_range_and_accuracy: number | null;
    coherence_and_cohesion: number | null;
    overall: number | null;
  };

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  feedback: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
