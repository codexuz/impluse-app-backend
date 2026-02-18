import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsReading } from "./ielts-reading.entity.js";

export enum ReadingPart {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
}

export enum DifficultyLevel {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

@Table({
  tableName: "ielts_reading_parts",
  timestamps: true,
})
export class IeltsReadingPart extends Model<IeltsReadingPart> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsReading)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  reading_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(ReadingPart)),
    allowNull: false,
  })
  part: ReadingPart;

  @Column({
    type: DataType.ENUM("practice", "mock"),
    allowNull: false,
  })
  mode: "practice" | "mock";

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  content: string;

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
