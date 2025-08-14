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
    allowNull: false,
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

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  exercise_id: string;

  @Column({
    type: DataType.DECIMAL(5, 2), //Calculate tasks and get percentage
    allowNull: true,
  })
  percentage: number;

  @Column({
    type: DataType.ENUM("passed", "failed", "incomplete"),
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.ENUM(
      "reading",
      "listening",
      "grammar",
      "writing",
      "speaking"
    ),
    allowNull: true,
  })
  section: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  file_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  feedback!: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
