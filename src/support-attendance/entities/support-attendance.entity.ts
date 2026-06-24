import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "support_attendance",
  timestamps: true,
  underscored: true,
})
export class SupportAttendance extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.UUID, allowNull: true })
  assignment_id!: string; // FK to SupportAssignment (optional context)

  @Column({ type: DataType.UUID, allowNull: false })
  support_teacher_id!: string; // FK to User where role = 'support_teacher'

  @Column({ type: DataType.UUID, allowNull: false })
  group_id!: string; // FK to Group

  @Column({ type: DataType.UUID, allowNull: false })
  student_id!: string; // FK to User where role = 'student'

  @Column({
    type: DataType.ENUM("present", "absent", "late"),
    allowNull: false,
  })
  status!: "present" | "absent" | "late";

  @Column({ type: DataType.STRING, allowNull: true })
  note!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
