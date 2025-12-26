import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  Unique,
} from "sequelize-typescript";
import { FeedVideo } from "./feed-video.js";

@Table({
  tableName: "video_likes",
  timestamps: true,
})
export class VideoLike extends Model<VideoLike> {
  @AllowNull(false)
  @ForeignKey(() => FeedVideo)
  @Column({
    type: DataType.INTEGER,
  })
  videoId: number;

  @AllowNull(false)
  @ForeignKey(() => require("../../users/entities/user.entity").default)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @BelongsTo(() => FeedVideo)
  video: FeedVideo;
}
