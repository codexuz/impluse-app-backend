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
  tableName: "certificates",
  timestamps: true,
})
export class Certificate extends Model<Certificate> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id: string;

  @BelongsTo(() => User)
  student: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  course_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  certificate_url: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  certificated_id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
