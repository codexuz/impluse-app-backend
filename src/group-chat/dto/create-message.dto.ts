import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
  AUDIO = 'audio',
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'Group ID where the message belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello everyone! How is the assignment going?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Type of the message',
    enum: MessageType,
    example: MessageType.TEXT,
    default: MessageType.TEXT,
  })
  @IsEnum(MessageType)
  @IsOptional()
  message_type?: MessageType = MessageType.TEXT;
}
