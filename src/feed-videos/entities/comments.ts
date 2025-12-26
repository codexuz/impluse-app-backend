import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { FeedVideo } from "./feed-video.js";

@Table({
  tableName: "video_comments",
  timestamps: true,
})
export class VideoComment extends Model<VideoComment> {
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

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  comment: string;

  @BelongsTo(() => FeedVideo)
  video: FeedVideo;
}
