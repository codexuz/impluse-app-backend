import {
    Table,
    Column,
    Model,
    DataType,
    CreatedAt,
    UpdatedAt,
    AllowNull,
  } from "sequelize-typescript";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

  interface NotificationCreationAttrs {
  title: string;
  message: string;
  img_url?: string;
}

  @Table({
    tableName: "notifications",
    timestamps: true,
  })
  export class Notifications extends Model<Notifications, NotificationCreationAttrs> {
    @ApiProperty({
      description: 'Unique identifier',
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string;
  
    @ApiPropertyOptional({
      description: 'Notification title',
      example: 'New Feature Alert'
    })
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    title: string;
  
    @ApiProperty({
      description: 'Notification message content',
      example: 'We have added new features to the platform!'
    })
    @Column({
      type: DataType.TEXT,
    })
    message!: string;
  
    @ApiProperty({
      description: 'URL to an image for the notification',
      example: 'https://example.com/images/notification-image.jpg'
    })
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    img_url!: string;
  
    @ApiProperty({
      description: 'Date when the notification was created',
      example: '2023-01-01T00:00:00.000Z'
    })
    @CreatedAt
    createdAt!: Date;
  
    @ApiProperty({
      description: 'Date when the notification was last updated',
      example: '2023-01-01T00:00:00.000Z'
    })
    @UpdatedAt
    updatedAt!: Date;
  }
  