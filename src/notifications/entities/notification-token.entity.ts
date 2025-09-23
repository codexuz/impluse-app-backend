import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

interface NotificationTokenCreationAttrs {
  token: string;
  user_id?: string;
}

@Table({
  tableName: "notification_tokens",
  timestamps: true,
})
export class NotificationToken extends Model<
  NotificationToken,
  NotificationTokenCreationAttrs
> {
  @ApiProperty({
    description: "Unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiPropertyOptional({
    description: "User ID associated with the notification",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  user_id: string;

  @ApiProperty({
    description: "Notification token string",
    example: "fcm_token_1234567890",
  })
  @Column({
    type: DataType.TEXT,
  })
  token!: string;

  @ApiProperty({
    description: "Date when the notification token was created",
    example: "2023-01-01T00:00:00.000Z",
  })
  @CreatedAt
  createdAt!: Date;

  @ApiProperty({
    description: "Date when the notification token was last updated",
    example: "2023-01-01T00:00:00.000Z",
  })
  @UpdatedAt
  updatedAt!: Date;
}
