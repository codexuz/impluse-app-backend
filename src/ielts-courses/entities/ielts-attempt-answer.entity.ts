import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsQuizAttempt } from "./ielts-quiz-attempt.entity.js";
import { IeltsQuizQuestion } from "./ielts-quiz-question.entity.js";
import { IeltsQuestionChoice } from "./ielts-question-choice.entity.js";

@Table({
  tableName: "ielts_attempt_answers",
  timestamps: true,
})
export class IeltsAttemptAnswer extends Model<IeltsAttemptAnswer> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsQuizAttempt)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attempt_id: string;

  @ForeignKey(() => IeltsQuizQuestion)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id: string;

  @ForeignKey(() => IeltsQuestionChoice)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  choice_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  answer_text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_correct: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  answered_at: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
