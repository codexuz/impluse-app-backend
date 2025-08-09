import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "support_bookings",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SupportBooking extends Model {
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
  student_id!: string;

  @Column({
    type: DataType.UUID,
  })
  schedule_id!: string;

  @Column({
    type: DataType.DATE,
  })
  booking_date!: Date;

  @Column({
    type: DataType.DATE,
  })
  start_time!: Date;

  @Column({
    type: DataType.DATE,
  })
  end_time!: Date;

  @Column(DataType.ENUM('pending', 'approved', 'cancelled'))
  status!: 'pending' | 'approved' | 'cancelled';

  @Column(DataType.TEXT)
  notes!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
