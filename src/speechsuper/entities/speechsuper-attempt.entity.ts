import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import { SpeechSuperQuestion } from "./speechsuper-question.entity.js";
import { SpeechSuperTopic } from "./speechsuper-topic.entity.js";
import type {
  SpeechSuperCoreType,
  SpeechSuperPartType,
} from "../speechsuper.constants.js";

/**
 * A student's attempt at a SpeechSuper question: the audio submitted,
 * the coreType used, the raw assessment result and the extracted scores.
 */
@Table({
  tableName: "speechsuper_attempts",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SpeechSuperAttempt extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => SpeechSuperQuestion)
  @Column({ type: DataType.UUID, allowNull: true })
  question_id: string;

  @ForeignKey(() => SpeechSuperTopic)
  @Column({ type: DataType.UUID, allowNull: true })
  topic_id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  student_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: "SpeechSuper coreType used for this attempt",
  })
  core_type: SpeechSuperCoreType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "Logical part type at the time of the attempt",
  })
  part_type: SpeechSuperPartType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "Reference text or prompt assessed against",
  })
  ref_text: string;

  @Column({ type: DataType.STRING, allowNull: true })
  audio_url: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "wav | mp3 | opus | ogg | amr",
  })
  audio_type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "ASR transcription returned by SpeechSuper (unscripted types)",
  })
  transcription: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: "Overall score (0-100)",
  })
  overall_score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: "Pronunciation sub-score (0-100)",
  })
  pronunciation_score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: "Fluency sub-score (0-100)",
  })
  fluency_score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: "Integrity/completeness sub-score (0-100)",
  })
  integrity_score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    comment: "Rhythm sub-score (0-100)",
  })
  rhythm_score: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: "Full raw SpeechSuper response payload",
  })
  result: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "SpeechSuper error code, if the assessment failed",
  })
  error: string;
}
