import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "articles",
  timestamps: true,
  paranoid: true,
})
export class Article extends Model<Article> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  seenCount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image: any;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  content: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
