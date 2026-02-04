import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsQuestion } from "./ielts-question.entity.js";
import { IeltsQuestionOption } from "./ielts-question-option.entity.js";
import { IeltsMultipleChoiceQuestion } from "./ielts-multiple-choice-question.entity.js";

export enum QuestionContentType {
  COMPLETION = "completion",
  MULTIPLE_CHOICE = "multiple-choice",
  MULTI_SELECT = "multi-select",
  SELECTION = "selection",
  DRAGGABLE_SELECTION = "draggable-selection",
  MATCHING = "matching",
}

@Table({
  tableName: "ielts_question_contents",
  timestamps: true,
})
export class IeltsQuestionContent extends Model<IeltsQuestionContent> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsQuestion)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(QuestionContentType)),
    allowNull: false,
  })
  type: QuestionContentType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  condition: string;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  limit: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  showOptions: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  optionsTitle: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
