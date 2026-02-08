import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsQuizQuestion } from "./ielts-quiz-question.entity.js";

@Table({
  tableName: "ielts_question_accepted_answers",
  timestamps: true,
})
export class IeltsQuestionAcceptedAnswer extends Model<IeltsQuestionAcceptedAnswer> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsQuizQuestion)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  answer_text: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
