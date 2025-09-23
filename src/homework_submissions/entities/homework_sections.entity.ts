import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "homework_sections",
  timestamps: true,
})
export class HomeworkSection extends Model {
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
  submission_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  exercise_id: string;

  @Column({
    type: DataType.FLOAT, // Calculate tasks and get score
    allowNull: true,
  })
  score: number;

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
    type: DataType.JSON,
    allowNull: true,
  })
  answers: { [key: string]: any };

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
