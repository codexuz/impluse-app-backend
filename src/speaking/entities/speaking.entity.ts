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
  title!: string;

  @Column({
    type: DataType.ENUM("pronunciation", "speaking"),
    allowNull: false,
  })
  type: string;
}
