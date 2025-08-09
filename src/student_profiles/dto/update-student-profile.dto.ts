import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { CreateStudentProfileDto } from './create-student-profile.dto.js';

export class UpdateStudentProfileDto extends PartialType(CreateStudentProfileDto) {
    @ApiProperty({
        description: 'Achievement points to add/subtract',
        example: 10,
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    points?: number;

    @ApiProperty({
        description: 'Coins to add/subtract',
        example: 5,
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    coins?: number;

    @ApiProperty({
        description: 'Update streak count',
        example: 1,
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(0)
    streaks?: number;
}
