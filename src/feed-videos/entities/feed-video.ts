import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { FeedVideoTask } from "./feed-video-task.entity.js";
import { VideoLike } from "./likes.js";
import { VideoComment } from "./comments.js";
import { VideoJudge } from "./judge.js";

@Table({
  tableName: "feed_videos",
  timestamps: true,
})
export class FeedVideo extends Model<FeedVideo> {
  @AllowNull(false)
  @ForeignKey(() => require("../../users/entities/user.entity").default)
  @Column({
    type: DataType.UUID,
  })
  studentId: string;

  @AllowNull(true)
  @ForeignKey(() => FeedVideoTask)
  @Column({
    type: DataType.INTEGER,
  })
  taskId: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  videoUrl: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  thumbnailUrl: string;

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
  averageFluencyScore: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.FLOAT,
  })
  averageClarityScore: number;

  @AllowNull(false)
  @Default("published")
  @Column({
    type: DataType.ENUM("draft", "published", "archived"),
  })
  status: "draft" | "published" | "archived";

  @BelongsTo(() => FeedVideoTask)
  task: FeedVideoTask;

  @HasMany(() => VideoLike)
  likes: VideoLike[];

  @HasMany(() => VideoComment)
  comments: VideoComment[];

  @HasMany(() => VideoJudge)
  judges: VideoJudge[];
}
