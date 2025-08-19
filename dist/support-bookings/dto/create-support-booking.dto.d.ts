export declare enum BookingStatus {
    PENDING = "pending",
    APPROVED = "approved",
    CANCELLED = "cancelled"
}
export declare class CreateSupportBookingDto {
    support_teacher_id: string;
    student_id: string;
    schedule_id: string;
    booking_date: Date;
    start_time: Date;
    end_time: Date;
    status?: BookingStatus;
    notes?: string;
}
