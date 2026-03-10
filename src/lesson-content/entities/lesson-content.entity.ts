import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export interface LessonContentItem {
  id: number;
  type: "text" | "image" | "audio" | "video" | "youtube_embed" | "iframe";
  content: string;
}

export interface LessonResource {
  id: number;
  type: "pdf" | "doc" | "excel" | "docx";
  url: string;
}

@Table({
  tableName: "lesson_contents",
  timestamps: true,
})
export class LessonContent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  content: LessonContentItem[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  resources: LessonResource[];

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lessonId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
