export declare class CreateHomeworkSubmissionDto {
    homework_id: string;
    student_id: string;
    lesson_id?: string;
    exercise_id?: string;
    percentage?: number;
    status?: string;
    section: string;
    file_url?: string;
    feedback?: string;
}
