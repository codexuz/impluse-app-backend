import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
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

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id: string;

  teacher: User;

  @Column({
    type: DataType.UUID,
    allowNull: true, // null for admins / teachers without a group on check-in
  })
  group_id: string | null;

  group: Group;

  @Column({
    type: DataType.ENUM("early", "on_time", "late", "excused"),
    allowNull: false,
  })
  status: "early" | "on_time" | "late" | "excused";

  @Column({
    type: DataType.UUID,
    allowNull: true, // set when an approved permission excused this record
  })
  permission_id: string | null;

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
