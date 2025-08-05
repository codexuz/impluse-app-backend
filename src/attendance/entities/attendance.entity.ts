import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({ tableName: "attendance" })
export class Attendance extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  lesson_id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  teacher_id: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
