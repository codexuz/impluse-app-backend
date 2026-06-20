import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsSpeaking } from "./ielts-speaking.entity.js";
import { IeltsSpeakingQuestion } from "./ielts-speaking-question.entity.js";

export enum SpeakingPart {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
}

/**
 * A part of an IELTS Speaking topic.
 *
 * - PART_1: short interview questions about familiar topics.
 * - PART_2: a cue card "long turn" — the candidate gets prep time then speaks
 *   alone for a fixed window. `cue_card` holds the task card text and
 *   `prep_seconds` / `speak_seconds` drive the server-side timers
 *   (defaults 60s prep, 120s speaking).
 * - PART_3: follow-up discussion questions linked to the Part 2 topic.
 */
@Table({
  tableName: "ielts_speaking_parts",
  timestamps: true,
})
export class IeltsSpeakingPart extends Model<IeltsSpeakingPart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsSpeaking)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  speaking_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(SpeakingPart)),
    allowNull: false,
  })
  part: SpeakingPart;

  // Topic/title of the part, e.g. "Hometown" or the Part 2 cue card title.
  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  title: string;

  // Cue card / task card text shown for PART_2 (and read out by the examiner).
  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  cue_card: string;

  // Preparation time in seconds (PART_2 only). Default 60s (1 minute).
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 60,
  })
  prep_seconds: number;

  // Speaking time in seconds (PART_2 only). Default 120s (2 minutes).
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 120,
  })
  speak_seconds: number;

  // Display/asking order of the parts within a topic.
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  order: number;

  @HasMany(() => IeltsSpeakingQuestion)
  questions: IeltsSpeakingQuestion[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
