import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { CreateRoleScenarioDto } from '../../role-scenarios/dto/create-role-scenario.dto.js';
import { CreatePronunciationExerciseDto } from '../../pronunciation-exercise/dto/create-pronunciation-exercise.dto.js';
import { CreateIeltspart1QuestionDto } from '../../ieltspart1-question/dto/create-ieltspart1-question.dto.js';
import { CreateIeltspart2QuestionDto } from '../../ieltspart2-question/dto/create-ieltspart2-question.dto.js';
import { CreateIeltspart3QuestionDto } from '../../ieltspart3-question/dto/create-ieltspart3-question.dto.js';

export class CreateSpeakingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [CreateRoleScenarioDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleScenarioDto)
  roleScenarios?: CreateRoleScenarioDto[];

  @ApiProperty({ type: [CreatePronunciationExerciseDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePronunciationExerciseDto)
  pronunciationExercises?: CreatePronunciationExerciseDto[];

  @ApiProperty({ type: [CreateIeltspart1QuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIeltspart1QuestionDto)
  ieltspart1Questions?: CreateIeltspart1QuestionDto[];

  @ApiProperty({ type: [CreateIeltspart2QuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIeltspart2QuestionDto)
  ieltspart2Questions?: CreateIeltspart2QuestionDto[];

  @ApiProperty({ type: [CreateIeltspart3QuestionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateIeltspart3QuestionDto)
  ieltspart3Questions?: CreateIeltspart3QuestionDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  instruction: string;

  @ApiProperty({ enum: ['A1', 'A2', 'B1', 'B2', 'C1'] })
  @IsEnum(['A1', 'A2', 'B1', 'B2', 'C1'])
  @IsNotEmpty()
  level: string;

  @ApiProperty({ enum: ['pronunciation', 'role-scenario', 'part_1', 'part_2', 'part_3'] })
  @IsEnum(['pronunciation', 'role-scenario', 'part_1', 'part_2', 'part_3'])
  @IsNotEmpty()
  type: string;
}