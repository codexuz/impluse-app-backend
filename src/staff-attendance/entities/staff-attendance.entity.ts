import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { Group } from "../../groups/entities/group.entity.js";

@Table({
  tableName: "staff_attendances",
  timestamps: true,
})
export class StaffAttendance extends Model {
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
  teacher_id: string;

  @BelongsTo(() => User, "teacher_id")
  teacher: User;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @BelongsTo(() => Group, "group_id")
  group: Group;

  @Column({
    type: DataType.ENUM("early", "on_time", "late"),
    allowNull: false,
  })
  status: "early" | "on_time" | "late";

  @Column({
    type: DataType.ENUM("in", "out"),
    allowNull: false,
    defaultValue: "in",
  })
  type: "in" | "out";

  @Column({
    type: DataType.INTEGER, // Fine amount, 0 if on time
    allowNull: false,
    defaultValue: 0,
  })
  fine_amount: number;

  @Column({
    type: DataType.INTEGER, // Minutes late
    allowNull: true,
    defaultValue: 0,
  })
  minutes_late: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
