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
  tableName: "exams",
  timestamps: true,
  paranoid: true, // This enables soft delete
})
export class Exam extends Model<Exam> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  scheduled_at: Date;

  @Column({
    type: DataType.ENUM("scheduled", "completed", "cancelled"),
    allowNull: true,
    defaultValue: "scheduled",
  })
  status: "scheduled" | "completed" | "cancelled";

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_online: boolean;

  @Column({
    type: DataType.ENUM(
      "beginner",
      "elementary",
      "pre-intermediate",
      "intermediate"
    ),
    allowNull: false,
    defaultValue: "beginner",
  })
  level: "beginner" | "elementary" | "pre-intermediate" | "intermediate";

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
