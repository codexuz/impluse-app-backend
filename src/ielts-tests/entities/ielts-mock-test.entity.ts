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
import { User } from "../../users/entities/user.entity.js";
import { IeltsTest } from "./ielts-test.entity.js";
import { Group } from "../../groups/entities/group.entity.js";

@Table({
  tableName: "ielts_mock_tests",
  timestamps: true,
  paranoid: true,
})
export class IeltsMockTest extends Model<IeltsMockTest> {
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

  @ForeignKey(() => IeltsTest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  test_id: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  group_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  teacher_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  listening_confirmed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  reading_confirmed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  writing_confirmed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  listening_finished: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  reading_finished: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  writing_finished: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  archived: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {
      listening_videoUrl: "",
      reading_videoUrl: "",
      writing_videoUrl: "",
    },
  })
  meta: {
    listening_videoUrl: string;
    reading_videoUrl: string;
    writing_videoUrl: string;
  };

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => IeltsTest)
  test: IeltsTest;

  @BelongsTo(() => Group)
  group: Group;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
