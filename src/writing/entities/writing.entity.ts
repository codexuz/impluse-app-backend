
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "writing",
  timestamps: true,
})
export class Writing extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.UUID)
  lessonId!: string;

  @Column(DataType.TEXT)
  question!: string;

  @Column(DataType.TEXT)
  instruction!: string;

   @Column(DataType.TEXT)
  sample_answer!: string;

}
