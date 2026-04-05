import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from "sequelize-typescript";
import { Questions } from "./questions.js";

@Table({
  tableName: "listen_and_choose",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ListenAndChoose extends Model {
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
    type: DataType.JSON,
    allowNull: false,
  })
  options: { text: string; is_correct: boolean }[];
}
