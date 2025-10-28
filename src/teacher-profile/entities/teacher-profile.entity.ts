import { all } from "node_modules/axios/index.cjs";
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "teacher_profiles",
  timestamps: true,
})
export class TeacherProfile extends Model<TeacherProfile> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column(DataType.UUID)
  user_id!: string;


  @Column({
    type: DataType.ENUM("percentage", "fixed"),
    allowNull: true,
  })
  payment_type!: "percentage" | "fixed";

    @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  payment_value!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  payment_day!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
