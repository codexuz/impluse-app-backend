import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsAnswerAttempt } from "./ielts-answer-attempt.entity.js";
import { IeltsQuestion } from "./ielts-question.entity.js";
import { IeltsReadingPart } from "./ielts-reading-part.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "ielts_reading_answers",
  timestamps: true,
})
export class IeltsReadingAnswer extends Model<IeltsReadingAnswer> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsAnswerAttempt)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attempt_id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => IeltsReadingPart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  part_id: string;

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
  question_number: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  answer: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_correct: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  correct_answer: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
