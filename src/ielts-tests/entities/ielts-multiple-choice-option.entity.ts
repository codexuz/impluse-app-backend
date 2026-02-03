import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsMultipleChoiceQuestion } from "./ielts-multiple-choice-question.entity.js";

@Table({
  tableName: "ielts_multiple_choice_options",
  timestamps: true,
})
export class IeltsMultipleChoiceOption extends Model<IeltsMultipleChoiceOption> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsMultipleChoiceQuestion)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  multiple_choice_question_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  label: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order: number;

  @BelongsTo(() => IeltsMultipleChoiceQuestion)
  multipleChoiceQuestion: IeltsMultipleChoiceQuestion;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
