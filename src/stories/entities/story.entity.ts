import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "stories",
  timestamps: true,
})
export class Story extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.TEXT,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
  })
  url!: string;

  @Column({
    type: DataType.TEXT,
  })
  image_url!: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isPublished!: boolean;

  @Column({
    type: DataType.INTEGER,
  })
  viewCount!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
