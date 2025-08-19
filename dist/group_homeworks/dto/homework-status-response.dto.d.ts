export declare class HomeworkSubmissionSummaryDto {
    homework_id: string;
    student_id: string;
    percentage: number;
    status: string;
    section: string;
}
export declare class HomeworkWithStatusDto {
    id: string;
    lesson_id: string;
    group_id: string;
    teacher_id: string;
    title: string;
    start_date: Date;
    deadline: Date;
    lesson: {
        id: string;
        title: string;
        lesson_number: number;
    };
    submissions: HomeworkSubmissionSummaryDto[];
    submissionCount: number;
    isOverdue: boolean;
}
export declare class StudentHomeworkStatusDto {
    studentId: string;
    groupId?: string;
    summary: {
        total: number;
        finished: number;
        unfinished: number;
        overdue: number;
    };
    finishedHomeworks: HomeworkWithStatusDto[];
    unfinishedHomeworks: HomeworkWithStatusDto[];
}
export declare class StudentSubmissionStatusDto {
    studentId: string;
    submissions: HomeworkSubmissionSummaryDto[];
    isFinished: boolean;
    submissionCount: number;
}
export declare class GroupHomeworkStatusDto {
    groupId: string;
    studentCount: number;
    summary: {
        totalHomeworks: number;
        overdueHomeworks: number;
    };
    homeworks: {
        id: string;
        lesson_id: string;
        group_id: string;
        teacher_id: string;
        title: string;
        start_date: Date;
        deadline: Date;
        lesson: {
            id: string;
            title: string;
            lesson_number: number;
        };
        studentSubmissions: StudentSubmissionStatusDto[];
        summary: {
            totalStudents: number;
            finished: number;
            unfinished: number;
            completionRate: string;
        };
        isOverdue: boolean;
    }[];
}
export declare class OverallHomeworkStatsDto {
    groupId?: string;
    totalHomeworks: number;
    overdueHomeworks: number;
    upcomingHomeworks: number;
    noDeadlineHomeworks: number;
}
