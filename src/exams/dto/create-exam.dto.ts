import { IsString, IsUUID, IsDate, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExamStatus {
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum ExamLevel {
    BEGINNER = 'beginner',
    ELEMETARY = 'elementary',
    PRE_INTERMEDIATE = 'pre-intermediate',
    INTERMEDIATE = 'intermediate'
}

export class CreateExamDto {
    @ApiProperty({
        description: 'The title of the exam',
        example: 'Final English Test'
    })
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The UUID of the group taking the exam',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    group_id: string;

    @ApiProperty({
        description: 'The scheduled date and time of the exam',
        example: '2025-07-20T14:00:00Z'
    })
    @IsDate()
    @Type(() => Date)
    scheduled_at: Date;

    @ApiPropertyOptional({
        description: 'The status of the exam',
        enum: ExamStatus,
        default: ExamStatus.SCHEDULED,
        example: ExamStatus.SCHEDULED
    })
    @IsEnum(ExamStatus)
    @IsOptional()
    status?: ExamStatus = ExamStatus.SCHEDULED;

    @ApiPropertyOptional({
        description: 'Whether the exam is conducted online',
        default: false,
        example: false
    })
    @IsBoolean()
    @IsOptional()
    is_online?: boolean = false;

    @ApiPropertyOptional({
        description: 'The difficulty level of the exam',
        enum: ExamLevel,
        default: ExamLevel.BEGINNER,
        example: ExamLevel.BEGINNER
    })
    @IsEnum(ExamLevel)
    @IsOptional()
    level?: ExamLevel = ExamLevel.BEGINNER;
}
