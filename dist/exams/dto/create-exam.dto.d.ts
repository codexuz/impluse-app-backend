export declare enum ExamStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum ExamLevel {
    BEGINNER = "beginner",
    ELEMETARY = "elementary",
    PRE_INTERMEDIATE = "pre-intermediate",
    INTERMEDIATE = "intermediate"
}
export declare class CreateExamDto {
    title: string;
    group_id: string;
    scheduled_at: Date;
    status?: ExamStatus;
    is_online?: boolean;
    level?: ExamLevel;
}
