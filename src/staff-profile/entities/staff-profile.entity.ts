import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";

@Table({
  tableName: "staff_profiles",
  timestamps: true,
})
export class StaffProfile extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  staff_id: string;

  staff: User;

  @Column({
    type: DataType.TIME, // Expected check-in time (HH:MM:SS)
    allowNull: true,
  })
  in_time: string | null;

  @Column({
    type: DataType.TIME, // Expected check-out time (HH:MM:SS)
    allowNull: true,
  })
  out_time: string | null;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
