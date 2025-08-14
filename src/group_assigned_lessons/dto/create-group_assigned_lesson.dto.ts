import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';

export class CreateGroupAssignedLessonDto {
    @ApiProperty({
        description: 'The UUID of the lesson to be assigned',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    lesson_id: string;

    @ApiProperty({
        description: 'The UUID of the group to assign the lesson to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty({
        description: 'The UUID of the user who granted this assignment',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    granted_by: string;

    @ApiProperty({
        description: 'The UUID of the assigned unit this lesson belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    group_assigned_unit_id: string;

    @ApiProperty({
        description: 'The date when the lesson becomes available',
        example: '2025-07-16'
    })
    @IsDateString()
    @IsNotEmpty()
    start_from: Date;

    @ApiProperty({
        description: 'The date when the lesson access ends',
        example: '2025-08-16'
    })
    @IsDateString()
    @IsNotEmpty()
    end_at: Date;

    @ApiProperty({
        description: 'The status of the lesson',
        enum: ['locked', 'unlocked'],
        example: 'unlocked'
    })
    @IsEnum(['locked', 'unlocked'])
    @IsNotEmpty()
    status: string;
}
