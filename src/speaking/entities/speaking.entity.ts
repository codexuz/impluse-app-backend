import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "speaking",
  timestamps: true,
})
export class Speaking extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.UUID)
  lessonId!: string;

  @Column(DataType.TEXT)
  topic!: string;

  @Column(DataType.TEXT)
  content!: string;

  @Column(DataType.TEXT)
  instruction!: string;

  @Column({
    type: DataType.ENUM("A1", "A2", "B1", "B2", "C1"),
    allowNull: false,
  })
  level: string;

  @Column({
    type: DataType.ENUM("pronunciation", "ielts", "cefr"),
    allowNull: false,
  })
  type: string;
}
