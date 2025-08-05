import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
  } from "sequelize-typescript";
  
  @Table({
    tableName: "lesson_progress",
    timestamps: true,
  })
  export class LessonProgress extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string;
  
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    student_id!: string;

    @Column({
        type: DataType.UUID,
        allowNull: false,
      })
    lesson_id!: string;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: true,
    })
    completed!: boolean;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }
  