import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsCourse } from "./ielts-course.entity.js";
import { IeltsCourseSection } from "./ielts-course-section.entity.js";
import { IeltsLesson } from "./ielts-lesson.entity.js";

@Table({
  tableName: "ielts_quizzes",
  timestamps: true,
})
export class IeltsQuiz extends Model<IeltsQuiz> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsCourse)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  course_id: string;

  @ForeignKey(() => IeltsCourseSection)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  section_id: string;

  @ForeignKey(() => IeltsLesson)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lesson_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  time_limit_seconds: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  attempts_allowed: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_published: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
