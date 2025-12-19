import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

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
  content: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  mediaUrl: string;

  @Column({
    type: DataType.ENUM("url", "youtube_url", "embed"),
    allowNull: true,
  })
  mediaType: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  resources: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_number: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  lessonId: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
