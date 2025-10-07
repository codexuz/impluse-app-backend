import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "student_books",
  timestamps: true,
})
export class StudentBook extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  level_id!: string;

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

