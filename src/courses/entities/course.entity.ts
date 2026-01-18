import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'courses',
  timestamps: true,
})
export class Course extends Model {
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
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1'),
    allowNull: true,
  })
  level: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

}
