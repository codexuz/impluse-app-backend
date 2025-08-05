// model
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

// Define the attributes interface
export interface LessonAttributes {
  id: string;
  title: string;
  order: number;
  isActive: boolean;
  type: 'lesson' | 'practice' | 'test';
  moduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define creation attributes (optional fields for creation)
export interface LessonCreationAttributes {
  title: string;
  order: number;
  isActive?: boolean;
  type?: 'lesson' | 'practice' | 'test';
  moduleId?: string;
}

@Table({
  tableName: 'lessons',
  timestamps: true,
})
export class Lesson extends Model<LessonAttributes, LessonCreationAttributes> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @Column({
    type: DataType.ENUM('lesson', 'practice', 'test'),
    defaultValue: 'lesson',
  })
  type!: 'lesson' | 'practice' | 'test';

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  moduleId?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}