import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsCourseSection } from "./ielts-course-section.entity.js";

export interface LessonContentItem {
  id: number;
  type: string;
  content: string;
}

@Table({
  tableName: "ielts_lessons",
  timestamps: true,
})
export class IeltsLesson extends Model<IeltsLesson> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsCourseSection)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  section_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  content: LessonContentItem[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  duration_seconds: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
