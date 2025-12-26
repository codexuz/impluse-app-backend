import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
} from "sequelize-typescript";
import { FeedVideo } from "./feed-video.js";
import { User } from "../../users/entities/user.entity.js";

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
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  comment: string;
}
