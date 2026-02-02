import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  ForeignKey,
  Unique,
  Index,
} from "sequelize-typescript";
import { Audio } from "./audio.entity.js";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "audio_likes",
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ["audioId", "userId"],
      name: "unique_audio_user_like",
    },
  ],
})
export class AudioLike extends Model<AudioLike> {
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
}
