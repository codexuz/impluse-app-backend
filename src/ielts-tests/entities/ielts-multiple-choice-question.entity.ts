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
  tableName: "ielts_sub_questions",
  timestamps: true,
})
export class IeltsSubQuestion extends Model<IeltsSubQuestion> {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  questionNumber: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  questionText: string;

  @Column({
    type: DataType.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 1,
  })
  points: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  correctAnswer: string;

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
