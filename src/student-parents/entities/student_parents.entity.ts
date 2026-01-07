import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "student_parents",
  timestamps: true,
})
export class StudentParent extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  student_id!: string;

  @Column({
    type: DataType.TEXT,
  })
  full_name!: string;

  @Column({
    type: DataType.TEXT,
  })
  phone_number!: string;

  @Column({
    type: DataType.TEXT,
  })
  additional_number!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
