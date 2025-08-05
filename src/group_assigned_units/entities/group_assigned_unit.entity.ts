import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
  } from "sequelize-typescript";
  
  @Table({
    tableName: "group_assigned_units",
    timestamps: true,
  })
  export class GroupAssignedUnit extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id: string;

    @Column({
      type: DataType.ENUM('locked', 'unlocked')
  })
  status: string
  
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    group_id!: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
      })
    unit_id!: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    teacher_id: string;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }
  