import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { IeltsLesson } from "./ielts-lesson.entity.js";

export enum LessonProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

@Table({
  tableName: "ielts_lesson_progress",
  timestamps: true,
})
export class IeltsLessonProgress extends Model<IeltsLessonProgress> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => IeltsLesson)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  lesson_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(LessonProgressStatus)),
    allowNull: false,
    defaultValue: LessonProgressStatus.NOT_STARTED,
  })
  status: LessonProgressStatus;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 0,
  })
  progress_percent: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_viewed_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completed_at: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
