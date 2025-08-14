import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt
} from 'sequelize-typescript';

@Table({
  tableName: 'books',
  timestamps: true,
  paranoid: true // This enables soft delete
})
export class Book extends Model<Book> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  author: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  thumbnail: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  url: string;

  @Column({
    type: DataType.ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2'),
    allowNull: false,
    defaultValue: 'A1'
  })
  level: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  views: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
