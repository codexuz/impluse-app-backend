export declare class HomeworkSectionResponseDto {
    id: string;
    submission_id: string;
    lesson_id?: string;
    exercise_id?: string;
    percentage?: number;
    status?: string;
    section: string;
    answers?: {
        [key: string]: any;
    };
    file_url?: string;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class HomeworkSubmissionResponseDto {
    id: string;
    homework_id: string;
    student_id: string;
    completion_percentage?: number;
    overall_status?: string;
    createdAt: Date;
    updatedAt: Date;
    sections?: HomeworkSectionResponseDto[];
}
export declare class HomeworkSubmissionWithSectionResponseDto {
    submission: HomeworkSubmissionResponseDto;
    section: HomeworkSectionResponseDto;
}
