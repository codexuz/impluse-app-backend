import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "student_book_units",
  timestamps: true,
})
export class StudentBookUnit extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  student_book_id!: string;

  @Column(DataType.UUID)
  unit_id!: string;

  @Column({
    type: DataType.TEXT,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
  })
  url!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
