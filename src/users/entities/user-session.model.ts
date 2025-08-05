import { 
  Table, 
  Column, 
  Model, 
  DataType, 
  ForeignKey, 
} from 'sequelize-typescript';

import { User } from '../../users/entities/user.entity.js';

@Table({
  tableName: 'user_sessions',
  timestamps: true
})
export class UserSession extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  userId: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  jwtToken: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  userAgent: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  ipAddress: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  expiresAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  lastAccessedAt: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  refreshToken: string;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  refreshTokenExpiresAt: Date;
}
