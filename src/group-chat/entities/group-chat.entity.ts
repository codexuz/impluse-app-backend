import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "group_chats",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class GroupChat extends Model {
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
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  image_url: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  link: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isPrivate: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
