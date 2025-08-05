import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  Unique,
  Default,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

import { Role } from './role.model.js';
import { UserSession } from './user-session.model.js';




@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model<User> {
 @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  user_id: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(50),
    validate: {
      notEmpty: true,
    },
  })
  username!: string;

  @AllowNull(false)
  @Column(DataType.STRING(555))
  password_hash!: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  level_id?: string;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING(100))
  phone?: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  first_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  last_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  avatar_url!: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  is_active!: boolean;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at!: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  last_login?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  currentSessionId: string;

  roles: Role[];

  sessions: UserSession[];

  // Note: Password hashing is handled in the service layer to avoid double hashing
}
