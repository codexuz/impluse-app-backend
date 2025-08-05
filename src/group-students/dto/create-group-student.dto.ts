import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupStudentDto {
    @ApiProperty({
        description: 'The UUID of the group',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty({
        description: 'The UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    student_id: string;

    @ApiProperty({
        description: 'The date when the student was enrolled',
        example: '2025-07-16T10:00:00Z'
    })
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    enrolled_at: Date;

    @ApiProperty({
        description: 'The status of the student in the group',
        enum: ['active', 'removed', 'completed', 'frozen'],
        example: 'active'
    })
    @IsEnum(['active', 'removed', 'completed', 'frozen'])
    @IsNotEmpty()
    status: string;
}
