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
import { IeltsQuestion } from "./ielts-question.entity.js";

export enum ReadingPart {
  PART_1 = "PART_1",
  PART_2 = "PART_2",
  PART_3 = "PART_3",
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
    type: DataType.STRING,
    allowNull: true,
  })
  passage_title: string;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  passage: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  answers: Record<string, any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
