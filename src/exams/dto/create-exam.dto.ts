import { IsString, IsUUID, IsDate, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExamStatus {
    SCHEDULED = 'scheduled',
    ONGOING = 'ongoing',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
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

    @ApiPropertyOptional({
        description: 'The UUID of the teacher conducting the exam',
        example: '123e4567-e89b-12d3-a456-426614174001'
    })
    @IsUUID()
    @IsOptional()
    teacher_id?: string;

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
        description: 'Whether a bonus or penalty has been applied for this exam',
        default: false,
        example: false
    })
    @IsBoolean()
    @IsOptional()
    bonusOrPenaltyAdded?: boolean = false;
}
