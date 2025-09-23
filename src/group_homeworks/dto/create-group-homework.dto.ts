import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateGroupHomeworkDto {
    @ApiProperty({
        description: 'The UUID of the lesson this homework is for',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    lesson_id: string;

    @ApiProperty({
        description: 'The UUID of the group to assign the homework to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsOptional()
    group_id?: string;

    @ApiProperty({
        description: 'The UUID of the teacher assigning the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsOptional()
    teacher_id?: string;

    @ApiProperty({
        description: 'The title of the homework',
        example: 'Grammar Exercise - Past Simple'
    })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: 'The start date for the homework (YYYY-MM-DD)',
        example: '2025-07-15'
    })
    @IsDateString()
    @IsOptional()
    start_date?: Date;

    @ApiProperty({
        description: 'The deadline for the homework (YYYY-MM-DD)',
        example: '2025-08-01'
    })
    @IsDateString()
    @IsOptional()
    deadline?: Date;
}
