import {
  Table,
  Column,
  DataType,
  Model,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table({
  tableName: "group_chat_members",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class GroupChatMembers extends Model {
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
  user_id: string;

  @Column({
    type: DataType.ENUM("admin", "member"),
    allowNull: true,
  })
  role: string;
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
