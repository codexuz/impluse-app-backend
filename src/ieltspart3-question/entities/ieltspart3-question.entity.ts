import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "ielstpart3_question",
  timestamps: true,
})
export class Ieltspart3Question extends Model {
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
