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
  tableName: "audio_judges",
  timestamps: true,
})
export class AudioJudge extends Model<AudioJudge> {
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
  judgeUserId: string; // Student who is judging

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
  })
  rating: number; // 0-5
}
