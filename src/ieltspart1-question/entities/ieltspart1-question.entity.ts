import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "ielstpart1_question",
  timestamps: true,
})
export class Ieltspart1Question extends Model {
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
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.ENUM("part_1.1", "part_1.2"),
    allowNull: true,
  })
  type: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  audio_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  audio_key: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  sample_answer: string;
}
