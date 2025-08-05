import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentProfileDto {
    @ApiProperty({
        description: 'The UUID of the user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({
        description: 'Achievement points of the student',
        example: 0,
        minimum: 0,
        default: 0
    })
    @IsNumber()
    @Min(0)
    points: number = 0;

    @ApiProperty({
        description: 'Virtual currency earned by the student',
        example: 0,
        minimum: 0,
        default: 0
    })
    @IsNumber()
    @Min(0)
    coins: number = 0;

    @ApiProperty({
        description: 'Number of consecutive days of activity',
        example: 0,
        minimum: 0,
        default: 0
    })
    @IsNumber()
    @Min(0)
    streaks: number = 0;
}
