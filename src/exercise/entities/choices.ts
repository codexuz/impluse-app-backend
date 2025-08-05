import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "choices",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Choices extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  question_id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  option_text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  is_correct: boolean;
}
