import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { IeltsQuiz } from "./ielts-quiz.entity.js";

@Table({
  tableName: "ielts_quiz_attempts",
  timestamps: true,
})
export class IeltsQuizAttempt extends Model<IeltsQuizAttempt> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => IeltsQuiz)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  quiz_id: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  started_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  submitted_at: Date;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
  })
  score: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: false,
    defaultValue: 0,
  })
  max_score: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
