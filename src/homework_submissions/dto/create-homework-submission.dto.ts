import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsNumber, IsEnum, IsString, Min, Max } from 'class-validator';

export class CreateHomeworkSubmissionDto {
    @ApiProperty({
        description: 'UUID of the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    homework_id: string;

    @ApiProperty({
        description: 'UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    student_id: string;
    
    @ApiProperty({
        description: 'UUID of the lesson',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    lesson_id?: string;

    @ApiProperty({
        description: 'UUID of the exercise',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    exercise_id?: string;

    @ApiProperty({
        description: 'Score achieved in this section (0-100)',
        example: 85.5,
        required: false,
        minimum: 0,
        maximum: 100
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    percentage?: number;

    @ApiProperty({
        description: 'Section of the homework',
        enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'],
        example: 'writing'
    })
    @IsEnum(['reading', 'listening', 'grammar', 'writing', 'speaking'])
    @IsNotEmpty()
    section: string;

    @ApiProperty({
        description: 'Student answers for the homework section',
        example: { 'question1': 'answer1', 'question2': 'answer2' },
        required: false
    })
    @IsOptional()
    answers?: { [key: string]: any };

    @ApiProperty({
        description: 'Teacher feedback on the submission',
        example: 'Good work, but needs improvement in section 2.',
        required: false
    })
    @IsString()
    @IsOptional()
    feedback?: string;
}
