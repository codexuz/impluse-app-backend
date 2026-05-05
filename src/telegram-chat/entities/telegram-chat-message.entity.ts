import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

export type MessageDirection = "incoming" | "outgoing";

@Table({
  tableName: "telegram_chat_messages",
  timestamps: true,
})
export class TelegramChatMessage extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  parent_id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  student_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  telegram_chat_id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;

  @Column({
    type: DataType.ENUM("incoming", "outgoing"),
    allowNull: false,
  })
  direction!: MessageDirection;

  /** Name of the CRM staff member who sent the outgoing message */
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sender_name!: string | null;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_read!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}
