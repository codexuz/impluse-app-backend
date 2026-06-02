import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "../../users/entities/user.entity.js";
import { StaffShift } from "./staff-shift.entity.js";

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
    unique: true,
  })
  staff_id: string;

  staff: User;
  shifts: StaffShift[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
