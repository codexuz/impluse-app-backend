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
  room_number: string;

  @Column({
    type: DataType.ENUM("odd", "even", "both"),
    allowNull: false,
  })
  day_time: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  start_time: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  end_time: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
