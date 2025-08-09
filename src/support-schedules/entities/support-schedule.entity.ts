import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "support_schedules",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SupportSchedule extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  support_teacher_id!: string;

  @Column({
    type: DataType.UUID,
  })
  group_id!: string;

  @Column({
    type: DataType.DATE,
  })
  schedule_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  start_time!: Date;

  @Column({
    type: DataType.DATE,
  })
  end_time!: Date;

  @Column(DataType.TEXT)
  topic!: string;

  @Column(DataType.TEXT)
  notes!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
