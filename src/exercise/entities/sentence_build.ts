import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Questions } from "./questions.js";

@Table({
  tableName: "sentence_build",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SentenceBuild extends Model {
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
  given_text: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  correct_answer: string;
}
