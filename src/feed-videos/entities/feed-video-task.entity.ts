import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "feed_video_tasks",
  timestamps: true,
})
export class FeedVideoTask extends Model<FeedVideoTask> {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  instructions: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  createdBy: string; // Admin user ID

  @AllowNull(false)
  @Default("active")
  @Column({
    type: DataType.ENUM("active", "inactive", "archived"),
  })
  status: "active" | "inactive" | "archived";

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
  })
  dueDate: Date;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  maxDurationSeconds: number;

  @AllowNull(true)
  @Column({
    type: DataType.JSON,
  })
  tags: string[];

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  submissionCount: number;
}
