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
  tableName: 'movies',
  timestamps: true,
  paranoid: true // This enables soft delete
})
export class Movie extends Model<Movie> {
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
    type: DataType.ENUM('action', 'comedy', 'drama', 'horror', 'sci-fi'),
    allowNull: false
  })
  genre: string;

@Column({
    type: DataType.ENUM('movie', 'cartoon', 'series'),
    allowNull: false
  })
  type: string;

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
