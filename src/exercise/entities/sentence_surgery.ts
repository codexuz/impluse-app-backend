import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Questions } from "./questions.js";

@Table({
  tableName: "sentence_surgery",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SentenceSurgery extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Questions)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  error_word: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  error_start: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  error_end: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  options: { text: string; is_correct: boolean }[];
}
