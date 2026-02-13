import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsListening } from "./ielts-listening.entity.js";
import { IeltsAudio } from "./ielts-audio.entity.js";

export enum ListeningPart {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
  PART_4 = "PART_4",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

@Table({
  tableName: "ielts_listening_parts",
  timestamps: true,
})
export class IeltsListeningPart extends Model<IeltsListeningPart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsListening)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  listening_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ListeningPart)),
    allowNull: false,
  })
  part: ListeningPart;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @ForeignKey(() => IeltsAudio)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  audio_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  timeLimitMinutes: number;

  @Column({
    type: DataType.ENUM(...Object.values(DifficultyLevel)),
    allowNull: true,
  })
  difficulty: DifficultyLevel;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalQuestions: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
