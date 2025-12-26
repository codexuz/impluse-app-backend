import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
  Default,
} from "sequelize-typescript";
import { FeedVideo } from "../../feed-videos/entities/feed-video.js";

@Table({
  tableName: "feed_video_notifications",
  timestamps: true,
})
export class FeedVideoNotification extends Model<FeedVideoNotification> {
  @AllowNull(false)
  @ForeignKey(() => require("../../users/entities/user.entity").default)
  @Column({
    type: DataType.UUID,
  })
  userId: string; // Recipient

  @AllowNull(true)
  @ForeignKey(() => require("../../users/entities/user.entity").default)
  @Column({
    type: DataType.UUID,
  })
  fromUserId: string; // Who triggered the notification

  @AllowNull(true)
  @ForeignKey(() => FeedVideo)
  @Column({
    type: DataType.INTEGER,
  })
  videoId: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM("LIKE", "COMMENT", "JUDGE", "VIDEO_UPLOAD"),
  })
  type: "LIKE" | "COMMENT" | "JUDGE" | "VIDEO_UPLOAD";

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  message: string;

  @AllowNull(false)
  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isRead: boolean;

  @BelongsTo(() => FeedVideo)
  video: FeedVideo;
}
