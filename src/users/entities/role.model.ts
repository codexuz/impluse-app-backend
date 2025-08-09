import { 
  Table, 
  Column, 
  Model, 
  DataType, 
} from 'sequelize-typescript';

import { User } from './user.entity.js';
import { Permission } from './permission.model.js';



@Table({
  tableName: 'roles',
  timestamps: true
})
export class Role extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  // Association fields without decorators since they are defined in models/index.ts
  users: User[];
  permissions: Permission[];
}
