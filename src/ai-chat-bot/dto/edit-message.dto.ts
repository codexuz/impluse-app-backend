import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class EditMessageDto {
  @ApiProperty({
    description: 'The message ID to edit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  messageId: string;

  @ApiProperty({
    description: 'The updated content of the message',
    example: 'This is the edited message text',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
