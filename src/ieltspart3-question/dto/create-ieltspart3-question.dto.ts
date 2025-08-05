import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateIeltspart3QuestionDto {
    @ApiProperty({
        description: 'UUID of the speaking test',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    speaking_id: string;

    @ApiProperty({
        description: 'The IELTS Part 3 question text',
        example: 'What are some of the main environmental challenges facing cities today?'
    })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({
        description: 'URL of the audio file for the question',
        example: 'https://storage.example.com/audio/part3-question1.mp3'
    })
    @IsUrl()
    @IsNotEmpty()
    audio_url: string;

    @ApiProperty({
        description: 'Sample answer for the question',
        example: 'Cities today face several significant environmental challenges. One of the most pressing issues is air pollution...'
    })
    @IsString()
    @IsNotEmpty()
    sample_answer: string;
}
