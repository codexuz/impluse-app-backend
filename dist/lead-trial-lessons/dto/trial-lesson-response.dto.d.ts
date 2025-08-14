export declare class TrialLessonResponseDto {
    id: string;
    scheduledAt: Date;
    status: string;
    teacher_id: string;
    lead_id: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class TrialLessonListResponseDto {
    trialLessons: TrialLessonResponseDto[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export declare class TrialLessonStatsResponseDto {
    totalTrialLessons: number;
    trialLessonsByStatus: {
        [key: string]: number;
    };
    trialLessonsByTeacher: {
        [key: string]: number;
    };
    upcomingTrialLessons: number;
}
