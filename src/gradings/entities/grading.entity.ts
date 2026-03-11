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
import { Group } from "../../groups/entities/group.entity.js";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

interface GradingCreationAttrs {
  student_id: string;
  teacher_id: string;
  group_id: string;
  grade: number;
  percent: number;
  lesson_name?: string;
}

@Table({
  tableName: "gradings",
  timestamps: true,
})
export class Grading extends Model<Grading, GradingCreationAttrs> {
  @ApiProperty({
    description: "Unique identifier for the grading",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({
    description: "ID of the student receiving the grade",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id!: string;

  @BelongsTo(() => User, "student_id")
  student: User;

  @ApiProperty({
    description: "ID of the teacher assigning the grade",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teacher_id!: string;

  @BelongsTo(() => User, "teacher_id")
  teacher: User;

  @ApiProperty({
    description: "ID of the group the student belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  group_id!: string;

  @BelongsTo(() => Group, "group_id")
  group: Group;

  @ApiProperty({
    description: "Grade assigned from 1 to 10",
    example: 8,
    minimum: 1,
    maximum: 10,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  })
  grade!: number;

  @ApiProperty({
    description: "Percentage assigned from 0 to 100",
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  percent!: number;

  @ApiProperty({
    description: "Date when the grading was created",
    example: "2023-01-01T00:00:00.000Z",
  })
  @CreatedAt
  createdAt!: Date;

  @ApiProperty({
    description: "Date when the grading was last updated",
    example: "2023-01-01T00:00:00.000Z",
  })
  @UpdatedAt
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: "Name of the lesson for the grading",
    example: "Introduction to Biology",
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lesson_name?: string;
}
