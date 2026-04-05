import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Questions } from "./questions.js";

@Table({
  tableName: "dictation",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Dictation extends Model {
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
  audio: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  correct_answer: string;
}
