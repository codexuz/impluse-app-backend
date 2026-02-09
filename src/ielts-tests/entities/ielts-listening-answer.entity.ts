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
import { IeltsQuestionContent } from "./ielts-question-content.entity.js";
import { IeltsListeningPart } from "./ielts-listening-part.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "ielts_listening_answers",
  timestamps: true,
})
export class IeltsListeningAnswer extends Model<IeltsListeningAnswer> {
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

  @ForeignKey(() => IeltsListeningPart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  part_id: string;

  @ForeignKey(() => IeltsQuestionContent)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_content_id: string;

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
