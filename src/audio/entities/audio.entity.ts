import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
} from "sequelize-typescript";
import { AudioTask } from "./audio-task.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "audios",
  timestamps: true,
})
export class Audio extends Model<Audio> {
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  studentId: string;

  @AllowNull(true)
  @ForeignKey(() => AudioTask)
  @Column({
    type: DataType.INTEGER,
  })
  taskId: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT, // Changed from STRING to handle long presigned URLs
  })
  audioUrl: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  caption: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  durationSeconds: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  likeCount: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  commentCount: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  judgeCount: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  viewCount: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.FLOAT,
  })
  trendingScore: number; // Calculated: likeCount + commentCount + (judgeCount * 3)

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.FLOAT,
  })
  averageRating: number;

  @AllowNull(false)
  @Default("published")
  @Column({
    type: DataType.ENUM(
      "draft",
      "published",
      "archived",
      "processing",
      "completed",
    ),
  })
  status: "draft" | "published" | "archived" | "processing" | "completed";
}
