import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsQuestionContent } from "./ielts-question-content.entity.js";
import { IeltsMultipleChoiceOption } from "./ielts-multiple-choice-option.entity.js";

@Table({
  tableName: "ielts_multiple_choice_questions",
  timestamps: true,
})
export class IeltsMultipleChoiceQuestion extends Model<IeltsMultipleChoiceQuestion> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsQuestionContent)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_content_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order: number;

  @BelongsTo(() => IeltsQuestionContent)
  questionContent: IeltsQuestionContent;

  @HasMany(() => IeltsMultipleChoiceOption)
  options: IeltsMultipleChoiceOption[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
