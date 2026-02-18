import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export enum DaysEnum {
  ODD = "odd",
  EVEN = "even",
  EVERY_DAY = "every_day",
  OTHER_DAY = "other_day",
}

@Table({
  tableName: "groups",
  timestamps: true,
})
export class Group extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  teacher_id: string; // FK to User where role = 'teacher'

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  level_id: string; // FK to Level

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  branch_id: string; // FK to Branch

  @Column({
    type: DataType.ENUM("odd", "even", "every_day", "other_day"),
    allowNull: true,
  })
  days: DaysEnum;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  lesson_start: string; // Format: HH:MM (e.g., "09:00")

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  lesson_end: string; // Format: HH:MM (e.g., "10:30")

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isIELTS: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
