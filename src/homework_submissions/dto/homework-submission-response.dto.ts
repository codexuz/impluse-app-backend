import { ApiProperty } from '@nestjs/swagger';

export class HomeworkSectionResponseDto {
    @ApiProperty({
        description: 'UUID of the section',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'UUID of the submission',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    submission_id: string;

    @ApiProperty({
        description: 'UUID of the lesson',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    lesson_id?: string;

    @ApiProperty({
        description: 'UUID of the exercise',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    exercise_id?: string;

    @ApiProperty({
        description: 'Score achieved in this section (0-100)',
        example: 85.5,
        required: false
    })
    percentage?: number;

    @ApiProperty({
        description: 'Status of this section',
        enum: ['passed', 'failed', 'incomplete'],
        example: 'passed',
        required: false
    })
    status?: string;

    @ApiProperty({
        description: 'Section type',
        enum: ['reading', 'listening', 'grammar', 'writing', 'speaking'],
        example: 'writing'
    })
    section: string;

    @ApiProperty({
        description: 'Student answers for this section',
        example: { 'question1': 'answer1', 'question2': 'answer2' },
        required: false
    })
    answers?: { [key: string]: any };

    @ApiProperty({
        description: 'URL of the submitted file for this section',
        example: 'https://storage.example.com/submissions/homework1.pdf',
        required: false
    })
    file_url?: string;

    @ApiProperty({
        description: 'Teacher feedback on this section',
        example: 'Good work, but needs improvement in section 2.',
        required: false
    })
    feedback?: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    updatedAt: Date;
}

export class HomeworkSubmissionResponseDto {
    @ApiProperty({
        description: 'UUID of the submission',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    id: string;

    @ApiProperty({
        description: 'UUID of the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    homework_id: string;

    @ApiProperty({
        description: 'UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    student_id: string;

    @ApiProperty({
        description: 'Overall completion percentage',
        example: 85.5,
        required: false
    })
    completion_percentage?: number;

    @ApiProperty({
        description: 'Overall submission status',
        enum: ['submitted', 'graded', 'not_submitted'],
        example: 'graded',
        required: false
    })
    overall_status?: string;

    @ApiProperty({
        description: 'Creation timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'Homework sections associated with this submission',
        type: [HomeworkSectionResponseDto],
        required: false
    })
    sections?: HomeworkSectionResponseDto[];
}

export class HomeworkSubmissionWithSectionResponseDto {
    @ApiProperty({
        description: 'The main homework submission',
        type: HomeworkSubmissionResponseDto
    })
    submission: HomeworkSubmissionResponseDto;

    @ApiProperty({
        description: 'The homework section',
        type: HomeworkSectionResponseDto
    })
    section: HomeworkSectionResponseDto;
}