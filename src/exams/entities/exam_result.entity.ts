import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from "sequelize-typescript";
import { Exam } from "./exam.entity.js";

@Table({
  tableName: "exam_results",
  timestamps: true,
})
export class ExamResult extends Model<ExamResult> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Exam)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  exam_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  score: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 100,
  })
  max_score: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  percentage: number;

  @Column({
    type: DataType.ENUM("passed", "failed"),
    allowNull: true,
  })
  result: "passed" | "failed";

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  section_scores: {
    reading?: number;
    writing?: number;
    listening?: number;
    speaking?: number;
    grammar?: number;
    vocabulary?: number;
  };

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  feedback: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_completed: boolean;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
