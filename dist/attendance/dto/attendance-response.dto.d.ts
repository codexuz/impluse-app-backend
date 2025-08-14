export declare class AttendanceResponseDto {
    id: string;
    group_id: string;
    student_id: string;
    teacher_id: string;
    status: string;
    note: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AttendanceStatsDto {
    total: number;
    present: number;
    absent: number;
    late: number;
    attendanceRate: string;
}
