import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateGroupAssignedUnitDto {
    @ApiProperty({
        description: 'The status of the unit',
        enum: ['locked', 'unlocked'],
        example: 'unlocked'
    })
    @IsEnum(['locked', 'unlocked'])
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        description: 'The UUID of the group to assign the unit to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    group_id: string;

    @ApiProperty({
        description: 'The UUID of the unit to be assigned',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    unit_id: string;

    @ApiProperty({
        description: 'The UUID of the teacher assigning the unit',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    teacher_id: string;

    @ApiProperty({
        description: 'The date when lessons should start',
        example: '2025-08-01',
        required: false
    })
    @IsDateString()
    @IsOptional()
    start_date?: Date;

    @ApiProperty({
        description: 'The date when lessons should end',
        example: '2025-09-01',
        required: false
    })
    @IsDateString()
    @IsOptional()
    end_date?: Date;
}
