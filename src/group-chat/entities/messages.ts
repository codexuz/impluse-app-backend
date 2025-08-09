import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "messages",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Messages extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  chat_group_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  sender_id: string;

   @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.ENUM("text", "image", "file", "video", "audio"),
    allowNull: true,
  })
  message_type: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
