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
  tableName: "ielts_question_choices",
  timestamps: true,
})
export class IeltsQuestionChoice extends Model<IeltsQuestionChoice> {
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
    type: DataType.TEXT,
    allowNull: false,
  })
  choice_text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_correct: boolean;

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
