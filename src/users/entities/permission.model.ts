import { 
  Table, 
  Column, 
  Model, 
  DataType, 
} from 'sequelize-typescript';




@Table({
  tableName: 'permissions',
  timestamps: true
})
export class Permission extends Model {
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
    allowNull: false
  })
  resource: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  action: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  description: string;

}