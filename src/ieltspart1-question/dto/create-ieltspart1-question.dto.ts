import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateIeltspart1QuestionDto {
    @ApiProperty({
        description: 'UUID of the speaking test',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    speaking_id: string;

    @ApiProperty({
        description: 'The IELTS Part 1 question text',
        example: 'What kind of food do you like to eat?'
    })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({
        description: 'URL of the audio file for the question',
        example: 'https://storage.example.com/audio/question1.mp3'
    })
    @IsUrl()
    @IsNotEmpty()
    audio_url: string;

    @ApiProperty({
        description: 'Sample answer for the question',
        example: 'I really enjoy eating various types of Asian cuisine, particularly Japanese food...'
    })
    @IsString()
    @IsNotEmpty()
    sample_answer: string;
}
