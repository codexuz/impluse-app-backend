import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateIeltspart2QuestionDto {
    @ApiProperty({
        description: 'UUID of the speaking test',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    speaking_id: string;

    @ApiProperty({
        description: 'The IELTS Part 2 question text',
        example: 'Describe a place you like to visit in your free time. You should say:\n- where it is\n- what you do there\n- who you go there with\n- and explain why you like going there.'
    })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({
        description: 'URL of the audio file for the question',
        example: 'https://storage.example.com/audio/part2-question1.mp3'
    })
    @IsUrl()
    @IsNotEmpty()
    audio_url: string;

    @ApiProperty({
        description: 'Sample answer for the question',
        example: 'I would like to talk about my favorite local park...'
    })
    @IsString()
    @IsNotEmpty()
    sample_answer: string;
}
