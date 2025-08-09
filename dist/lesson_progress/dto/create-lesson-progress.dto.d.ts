export declare class CreateLessonProgressDto {
    student_id: string;
    lesson_id: string;
    completed?: boolean;
    progress_percentage?: number;
    reading_completed?: boolean;
    listening_completed?: boolean;
    grammar_completed?: boolean;
    writing_completed?: boolean;
    speaking_completed?: boolean;
}
