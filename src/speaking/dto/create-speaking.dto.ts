import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateRoleScenarioDto } from '../../role-scenarios/dto/create-role-scenario.dto.js';
import { CreatePronunciationExerciseDto } from '../../pronunciation-exercise/dto/create-pronunciation-exercise.dto.js';
import { CreateIeltspart1QuestionDto } from '../../ieltspart1-question/dto/create-ieltspart1-question.dto.js';
import { CreateIeltspart2QuestionDto } from '../../ieltspart2-question/dto/create-ieltspart2-question.dto.js';
import { CreateIeltspart3QuestionDto } from '../../ieltspart3-question/dto/create-ieltspart3-question.dto.js';

export class CreateSpeakingDto {
  @ApiProperty({
    description: 'UUID of the lesson this speaking exercise belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty({
    description: 'Title of the speaking exercise',
    example: 'Travel and Tourism Discussion'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: ['pronunciation', 'speaking'],
    description: 'Type of speaking exercise',
    example: 'speaking'
  })
  @IsEnum(['pronunciation', 'speaking'])
  @IsNotEmpty()
  type: string;
}