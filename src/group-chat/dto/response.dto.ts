import { ApiProperty } from '@nestjs/swagger';

export class GroupChatResponseDto {
  @ApiProperty({
    description: 'Group chat ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the group chat',
    example: 'Math Study Group',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the group chat',
    example: 'A group for discussing math homework and study sessions',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL for the group chat',
    example: 'https://example.com/group-image.jpg',
    required: false,
  })
  image_url?: string;

  @ApiProperty({
    description: 'Link for the group chat',
    example: 'https://example.com/group-link',
    required: false,
  })
  link?: string;

  @ApiProperty({
    description: 'Whether the group chat is private',
    example: false,
  })
  isPrivate: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class MessageResponseDto {
  @ApiProperty({
    description: 'Message ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Group ID where the message belongs',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  chat_group_id: string;

  @ApiProperty({
    description: 'Sender user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  sender_id: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello everyone! How is the assignment going?',
  })
  content: string;

  @ApiProperty({
    description: 'Type of the message',
    example: 'text',
    enum: ['text', 'image', 'file', 'video', 'audio'],
  })
  message_type: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class GroupMemberResponseDto {
  @ApiProperty({
    description: 'Member ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Group ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  chat_group_id: string;

  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Role of the member in the group',
    example: 'member',
    enum: ['admin', 'member'],
  })
  role: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of data items',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 50,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
  })
  message: string;
}
