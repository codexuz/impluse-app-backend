export declare class CreateHomeworkSubmissionDto {
    homework_id: string;
    student_id: string;
    lesson_id?: string;
    exercise_id?: string;
    speaking_id?: string;
    percentage?: number;
    section: string;
    answers?: {
        [key: string]: any;
    };
    feedback?: string;
}
