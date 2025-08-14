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
import { Lesson } from "../../lesson/entities/lesson.entity.js";
  
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

    @ForeignKey(() => Lesson)
    @Column({
        type: DataType.UUID,
        allowNull: false,
      })
    lesson_id!: string;

    @BelongsTo(() => Lesson)
    lesson!: Lesson;
  
    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    completed!: boolean;

    @Column({
      type: DataType.DECIMAL(5, 2),
      defaultValue: 0.00,
      allowNull: false,
    })
    progress_percentage!: number;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    reading_completed!: boolean;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    listening_completed!: boolean;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    grammar_completed!: boolean;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    writing_completed!: boolean;

    @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
    })
    speaking_completed!: boolean;

    @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
    })
    completed_sections_count!: number;

    @Column({
      type: DataType.INTEGER,
      defaultValue: 5, // Total sections: reading, listening, grammar, writing, speaking
    })
    total_sections_count!: number;
  
    @CreatedAt
    createdAt!: Date;
  
    @UpdatedAt
    updatedAt!: Date;
  }
  