import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoleScenarioDto {
  @ApiProperty({ description: 'ID of the speaking exercise' })
  @IsUUID()
  @IsNotEmpty()
  speaking_id: string;

  @ApiProperty({ description: 'The sentence or response from the bot' })
  @IsString()
  @IsNotEmpty()
  bot_sentence: string;

  @ApiProperty({ description: 'The expected user response or sentence' })
  @IsString()
  @IsNotEmpty()
  user_sentence: string;
}
