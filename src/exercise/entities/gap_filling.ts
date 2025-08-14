import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "gap_filling",
  timestamps: true,
})
export class GapFilling extends Model {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  gap_number: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  correct_answer: string[];
}
