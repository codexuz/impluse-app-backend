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
import { IeltsQuestionContent } from "./ielts-question-content.entity.js";

@Table({
  tableName: "ielts_question_options",
  timestamps: true,
})
export class IeltsQuestionOption extends Model<IeltsQuestionOption> {
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

  @BelongsTo(() => IeltsQuestionContent)
  questionContent: IeltsQuestionContent;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
