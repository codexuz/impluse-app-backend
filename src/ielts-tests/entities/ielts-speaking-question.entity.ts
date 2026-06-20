import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsSpeakingPart } from "./ielts-speaking-part.entity.js";

/**
 * A single question the AI examiner asks within a part.
 *
 * For PART_1 / PART_3 these are the interview/discussion questions asked one
 * at a time. For PART_2 these are the bullet prompts on the cue card (the
 * "You should say…" points).
 */
@Table({
  tableName: "ielts_speaking_questions",
  timestamps: true,
})
export class IeltsSpeakingQuestion extends Model<IeltsSpeakingQuestion> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsSpeakingPart)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  part_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question_text: string;

  // Order the examiner asks the questions in.
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  order: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
