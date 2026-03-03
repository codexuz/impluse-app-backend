import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "homework_submission",
  timestamps: true,
})
export class HomeworkSubmission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  homework_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  student_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lesson_id: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
