import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey 
} from 'sequelize-typescript';

import { User } from './user.entity.js';
import { Role } from './role.model.js';

@Table({
  tableName: 'user_roles',
  timestamps: true
})
export class UserRole extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  roleId: number;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  assignedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  expiresAt: Date;
}