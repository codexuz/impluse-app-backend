import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
  } from "sequelize-typescript";
  
  @Table({ tableName: "attendance_status" })

  export class AttendanceStatus extends Model {
    @PrimaryKey
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
    })
    id: string;
  
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    attendance_id: string;
  
    @Column({ type: DataType.UUID, allowNull: false })
    student_id: string;
  
    @Column({ 
        type: DataType.ENUM('present', 'absent', 'late'), 
        allowNull: false 
    })
    status: string;
  
    @Column({ type: DataType.STRING, allowNull: false })
    note: string;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  }
  