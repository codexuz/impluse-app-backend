import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsNumber, IsEnum, IsString, IsUrl, Min, Max } from 'class-validator';

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
        description: 'Completion percentage of homework',
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
        description: 'Status of homework submission',
        enum: ['passed', 'failed', 'incomplete'],
        example: 'passed',
        required: false
    })
    @IsEnum(['passed', 'failed', 'incomplete'])
    @IsOptional()
    status?: string;

    @ApiProperty({
        description: 'Section of the homework',
        enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'],
        example: 'writing'
    })
    @IsEnum(['reading', 'listening', 'grammar', 'writing', 'speaking'])
    @IsNotEmpty()
    section: string;

    @ApiProperty({
        description: 'URL of the submitted file',
        example: 'https://storage.example.com/submissions/homework1.pdf',
        required: false
    })
    @IsUrl()
    @IsOptional()
    file_url?: string;

    @ApiProperty({
        description: 'Teacher feedback on the submission',
        example: 'Good work, but needs improvement in section 2.',
        required: false
    })
    @IsString()
    @IsOptional()
    feedback?: string;
}
