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

  @ForeignKey(() => IeltsQuestion)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  optionKey: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  optionText: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isCorrect: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderIndex: number;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  explanation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  fromPassage: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
