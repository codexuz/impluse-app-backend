import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "student_profiles",
  timestamps: true,
})
export class StudentProfile extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  user_id!: string;


  @Column({
    type: DataType.INTEGER,
    defaultValue: true,
  })
  points!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: true,
  })
  coins!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: true,
  })
  streaks!: number;

   // Moderation
  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  strikes!: number

   @Column({ type: DataType.INTEGER, defaultValue: 1 })
  level!: number

  @Column(DataType.DATEONLY)
  last_active_date?: string

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
