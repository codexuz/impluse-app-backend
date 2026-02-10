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

export enum LessonType {
  VIDEO = "video",
  TEXT = "text",
  AUDIO = "audio",
  LIVE = "live",
  ASSIGNMENT = "assignment",
}

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
    type: DataType.ENUM(...Object.values(LessonType)),
    allowNull: false,
    defaultValue: LessonType.VIDEO,
  })
  lesson_type: LessonType;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  content_url: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  content_text: LessonContentItem[];

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
