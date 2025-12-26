import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  Default,
} from "sequelize-typescript";
import { FeedVideo } from "./feed-video.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "video_judges",
  timestamps: true,
})
export class VideoJudge extends Model<VideoJudge> {
  @AllowNull(false)
  @ForeignKey(() => FeedVideo)
  @Column({
    type: DataType.INTEGER,
  })
  videoId: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  judgeUserId: string; // Student who is judging

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  fluencyScore: number; // 1-10

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  clarityScore: number; // 1-10

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  feedback: string;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  helpfulCount: number; // Other students can mark judge as helpful
}
