import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  Unique,
} from "sequelize-typescript";
import { FeedVideo } from "./feed-video.js";
import { User } from "../../users/entities/user.entity.js";

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
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;
}
