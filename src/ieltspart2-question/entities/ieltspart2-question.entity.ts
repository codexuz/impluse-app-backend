import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "ielstpart2_question",
  timestamps: true,
})
export class Ieltspart2Question extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.UUID)
  speaking_id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  audio_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  sample_answer: string;
}
