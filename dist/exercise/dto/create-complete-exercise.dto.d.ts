export declare enum ExerciseType {
    GRAMMAR = "grammar",
    READING = "reading",
    LISTENING = "listening",
    WRITING = "writing"
}
export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    FILL_IN_THE_BLANK = "fill_in_the_blank",
    TRUE_FALSE = "true_false",
    SHORT_ANSWER = "short_answer",
    MATCHING = "matching"
}
export declare class CreateSentenceBuildDto {
    given_text: string;
    correct_answer: string;
}
export declare class CreateExerciseDto {
    title: string;
    exercise_type: ExerciseType;
    audio_url?: string;
    image_url?: string;
    instructions?: string;
    content?: string;
    isActive?: boolean;
    lessonId?: string;
}
export declare class CreateQuestionDto {
    question_type: QuestionType;
    question_text: string;
    points?: number;
    order_number: number;
    sample_answer?: string;
}
export declare class CreateChoiceDto {
    option_text: string;
    is_correct: boolean;
}
export declare class CreateGapFillingDto {
    gap_number: number;
    correct_answer: string[];
}
export declare class CreateMatchingPairDto {
    left_item: string;
    right_item: string;
}
export declare class CreateTypingExerciseDto {
    correct_answer: string;
    is_case_sensitive: boolean;
}
export declare class CreateCompleteQuestionDto extends CreateQuestionDto {
    choices?: CreateChoiceDto[];
    gap_filling?: CreateGapFillingDto[];
    matching_pairs?: CreateMatchingPairDto[];
    typing_exercise?: CreateTypingExerciseDto;
    sentence_build?: CreateSentenceBuildDto | CreateSentenceBuildDto[];
}
export declare class CreateCompleteExerciseDto extends CreateExerciseDto {
    questions: CreateCompleteQuestionDto[];
}
