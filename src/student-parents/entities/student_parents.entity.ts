import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";

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

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  student_id!: string;

  @BelongsTo(() => User, "student_id")
  student?: User;

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
