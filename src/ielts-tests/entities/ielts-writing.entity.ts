import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IeltsTest } from "./ielts-test.entity.js";
import { IeltsWritingTask } from "./ielts-writing-task.entity.js";

@Table({
  tableName: "ielts_writing",
  timestamps: true,
})
export class IeltsWriting extends Model<IeltsWriting> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => IeltsTest)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  test_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
