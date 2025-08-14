export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late"
}
export declare class CreateAttendanceDto {
    group_id: string;
    student_id: string;
    teacher_id: string;
    status: AttendanceStatus;
    note?: string;
    date: string;
}
