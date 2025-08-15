import { Model } from "sequelize-typescript";
export declare class SupportBooking extends Model {
    id: string;
    support_teacher_id: string;
    student_id: string;
    schedule_id: string;
    booking_date: Date;
    start_time: Date;
    end_time: Date;
    status: 'pending' | 'approved' | 'cancelled';
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
