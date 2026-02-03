import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsWriting } from "./ielts-writing.entity.js";

export enum WritingTask {
  TASK_1 = "TASK_1",
  TASK_2 = "TASK_2",
}

@Table({
  tableName: "ielts_writing_tasks",
  timestamps: true,
})
export class IeltsWritingTask extends Model<IeltsWritingTask> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => IeltsWriting)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  writing_id: string;

  @Column({
    type: DataType.ENUM(...Object.values(WritingTask)),
    allowNull: false,
  })
  task: WritingTask;

  @Column({
    type: DataType.TEXT("long"),
    allowNull: true,
  })
  prompt: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  instructions: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  min_words: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  suggested_time: number;

  @BelongsTo(() => IeltsWriting)
  writing: IeltsWriting;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
