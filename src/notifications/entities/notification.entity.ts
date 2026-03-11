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
  body: string;
  data?: any;
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
      description: 'Notification body content',
      example: 'We have added new features to the platform!'
    })
    @Column({
      type: DataType.TEXT,
    })
    body!: string;
  
    @ApiPropertyOptional({
      description: 'Additional data for the notification',
      example: { key: 'value' }
    })
    @Column({
      type: DataType.JSON,
      allowNull: true,
    })
    data!: any;
  
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
  