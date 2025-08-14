import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({
        description: 'The title of the course',
        minLength: 3,
        example: 'English Grammar Basics'
    })
    @IsString()
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'A detailed description of the course content',
        required: false,
        example: 'Learn the fundamentals of English grammar including parts of speech, sentence structure, and punctuation.'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The level of the course',
        required: false,
        example: 'A1'
    })
    @IsString()
    @IsOptional()
    level?: string;

    @ApiProperty({
        description: 'Whether the course is active and visible to students',
        required: false,
        default: true,
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    @ApiProperty({
        description: 'URL of the course cover image',
        required: false,
        example: 'https://example.com/images/course-cover.jpg'
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
