export declare class CreateSpeakingResponseDto {
    speaking_id: string;
    student_id: string;
    response_type: 'part1' | 'part2' | 'part3' | 'pronunciation';
    audio_url?: string[];
    transcription?: string;
    result?: any;
    pronunciation_score?: number;
    feedback?: string;
}
