import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
}

export enum AttendanceAction {
  STATUS_CREATED = "STATUS_CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
}

@Table({ tableName: "attendance_logs" })
export class AttendanceLog extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM("present", "absent"),
    allowNull: false,
  })
  new_status: AttendanceStatus;

  @Column({
    type: DataType.ENUM("present", "absent"),
    allowNull: true,
  })
  old_status: AttendanceStatus;

  @Column({
    type: DataType.ENUM("STATUS_CREATED", "STATUS_CHANGED"),
    allowNull: false,
  })
  action: AttendanceAction;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  marked_by: string; // FK to User (user_id)

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string; // FK to User (student)

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attendance_id: string; // FK to Attendance

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
