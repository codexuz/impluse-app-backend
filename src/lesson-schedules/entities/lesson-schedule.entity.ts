import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({
  tableName: "lesson_schedules",
  timestamps: true,
  paranoid: true, // This enables soft delete
})
export class LessonSchedule extends Model<LessonSchedule> {
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
  group_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  lesson_name: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  date: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
