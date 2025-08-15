export declare enum ExerciseType {
    GRAMMAR = "grammar",
    READING = "reading",
    LISTENING = "listening",
    WRITING = "writing"
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
