import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from "sequelize-typescript";

@Table({
  tableName: "videos",
  timestamps: true,
  paranoid: true, // This enables soft delete
})
export class Video extends Model<Video> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  level: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  subtitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  thumbnail: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  views: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  source: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
