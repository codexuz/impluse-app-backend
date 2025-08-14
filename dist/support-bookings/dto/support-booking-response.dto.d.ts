import { BookingStatus } from './create-support-booking.dto.js';
export declare class SupportBookingResponseDto {
    id: string;
    support_teacher_id: string;
    student_id: string;
    schedule_id: string;
    booking_date: Date;
    start_time: Date;
    end_time: Date;
    status: BookingStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
