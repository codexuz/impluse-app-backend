import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey 
} from 'sequelize-typescript';

import { Role } from './role.model.js';
import { Permission } from './permission.model.js';


@Table({
  tableName: 'role_permissions',
  timestamps: true
})
export class RolePermission extends Model {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  roleId: number;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  permissionId: number;
}