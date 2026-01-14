import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "compensate_lessons",
  timestamps: false,
})
export class CompensateLesson extends Model<CompensateLesson> {
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

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  attendance_id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  compensated: boolean;

  @Column({
    type: DataType.ENUM("support_teacher", "main_teacher"),
    allowNull: true,
  })
  compensated_by: "support_teacher" | "main_teacher";

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  valid_until: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;
}
