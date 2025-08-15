export declare class ExerciseWithStatusDto {
    id: string;
    exercise_type: string;
    lesson_id: string;
    status: 'finished' | 'unfinished';
    submission?: {
        id: string;
        homework_id: string;
        student_id: string;
        percentage: number;
        status: string;
        section: string;
    } | null;
}
export declare class SpeakingWithStatusDto {
    id: string;
    lesson_id: string;
    status: 'finished' | 'unfinished';
    submission?: {
        id: string;
        homework_id: string;
        student_id: string;
        percentage: number;
        status: string;
        section: string;
    } | null;
}
export declare class VocabularyWithStatusDto {
    id: string;
    lesson_id: string;
    status: 'finished' | 'unfinished';
    submission?: {
        id: string;
        homework_id: string;
        student_id: string;
        percentage: number;
        status: string;
        section: string;
    } | null;
}
export declare class LessonWithExerciseStatusDto {
    id: string;
    title: string;
    lesson_number: number;
    theory?: any;
    exercises: ExerciseWithStatusDto[];
    speaking?: SpeakingWithStatusDto;
    lesson_vocabulary: VocabularyWithStatusDto[];
}
export declare class HomeworkWithExerciseStatusDto {
    id: string;
    lesson_id: string;
    group_id: string;
    teacher_id: string;
    title: string;
    start_date: Date;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    lesson: LessonWithExerciseStatusDto;
    homeworkStatus: 'finished' | 'unfinished';
    submissionCount: number;
    isOverdue: boolean;
    isActive?: boolean;
}
