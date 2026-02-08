import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsQuiz } from "./ielts-quiz.entity.js";

export enum QuestionType {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_TEXT = "short_text",
}

@Table({
  tableName: "ielts_quiz_questions",
  timestamps: true,
})
export class IeltsQuizQuestion extends Model<IeltsQuizQuestion> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsQuiz)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  quiz_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(QuestionType)),
    allowNull: false,
  })
  question_type: QuestionType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  prompt: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  explanation: string;

  @Column({
    type: DataType.DECIMAL(6, 2),
    allowNull: false,
    defaultValue: 1.0,
  })
  points: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
