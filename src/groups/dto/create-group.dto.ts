import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateGroupDto {
    @ApiProperty({
        description: 'The name of the group',
        example: 'Advanced English 101'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'UUID of the teacher assigned to the group',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    teacher_id?: string;

    @ApiProperty({
        description: 'UUID of the level assigned to the group',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    })
    @IsUUID()
    @IsOptional()
    level_id?: string;
}
