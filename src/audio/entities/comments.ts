import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  Default,
} from "sequelize-typescript";
import { Audio } from "./audio.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "audio_comments",
  timestamps: true,
})
export class AudioComment extends Model<AudioComment> {
  @AllowNull(false)
  @ForeignKey(() => Audio)
  @Column({
    type: DataType.INTEGER,
  })
  audioId: number;

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

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  likeCount: number; // Track likes on comments
}
