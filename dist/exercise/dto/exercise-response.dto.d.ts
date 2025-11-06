export declare class ChoiceResponseDto {
    id: string;
    question_id: string;
    option_text: string;
    is_correct: boolean;
}
export declare class GapFillingResponseDto {
    id: string;
    question_id: string;
    gap_number: number;
    correct_answer: string[];
}
export declare class MatchingPairResponseDto {
    id: string;
    question_id: string;
    left_item: string;
    right_item: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TypingExerciseResponseDto {
    id: string;
    question_id: string;
    correct_answer: string;
    is_case_sensitive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class QuestionResponseDto {
    id: string;
    exercise_id: string;
    question_type: string;
    question_text: string;
    points?: number;
    order_number: number;
    sample_answer?: string;
    createdAt: Date;
    updatedAt: Date;
    choices?: ChoiceResponseDto[];
    gapFilling?: GapFillingResponseDto[];
    matchingPairs?: MatchingPairResponseDto[];
    typingExercise?: TypingExerciseResponseDto;
}
export declare class ExerciseResponseDto {
    id: string;
    title: string;
    exercise_type: string;
    audio_url?: string;
    image_url?: string;
    instructions?: string;
    content?: string;
    isActive: boolean;
    lessonId?: string;
    createdAt: Date;
    updatedAt: Date;
    questions?: QuestionResponseDto[];
}
