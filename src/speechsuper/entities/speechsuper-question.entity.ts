import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import { SpeechSuperTopic } from "./speechsuper-topic.entity.js";
import type { SpeechSuperPartType } from "../speechsuper.constants.js";

/**
 * A single practice item inside a topic. Depending on `part_type` it is
 * scripted (word/sentence/paragraph — `ref_text` is read aloud) or
 * unscripted (IELTS part1/2/3 / general — `prompt` is the question shown).
 */
@Table({
  tableName: "speechsuper_questions",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SpeechSuperQuestion extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => SpeechSuperTopic)
  @Column({ type: DataType.UUID, allowNull: false })
  topic_id: string;

  @Column({
    type: DataType.ENUM(
      "word",
      "sentence",
      "paragraph",
      "part1",
      "part2",
      "part3",
      "general",
    ),
    allowNull: false,
    comment: "Logical part type; determines the SpeechSuper coreType used",
  })
  part_type: SpeechSuperPartType;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      "Question/prompt shown to the student (used for unscripted IELTS/general parts)",
  })
  prompt: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment:
      "Reference text the student must read aloud (required for scripted word/sentence/paragraph parts)",
  })
  ref_text: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "Optional hint / sample answer shown to the student",
  })
  hint: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: "Optional reference audio URL (teacher model answer)",
  })
  audio_url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Ordering index within the topic",
  })
  sort_order: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;
}
