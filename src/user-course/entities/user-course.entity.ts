import { Table, Column, Model, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'user_courses',
  timestamps: true,
})
export class UserCourse extends Model {
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
  
  userId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  enrolledAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isCompleted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completedAt: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
