import { CreateSupportBookingDto, UpdateSupportBookingDto, BookingStatus } from './dto/index.js';
import { SupportBooking } from './entities/support-booking.entity.js';
export declare class SupportBookingsService {
    private supportBookingModel;
    constructor(supportBookingModel: typeof SupportBooking);
    create(createSupportBookingDto: CreateSupportBookingDto): Promise<SupportBooking>;
    findAll(): Promise<SupportBooking[]>;
    findOne(id: string): Promise<SupportBooking>;
    findByStudent(studentId: string): Promise<SupportBooking[]>;
    findByTeacher(teacherId: string): Promise<SupportBooking[]>;
    findByStatus(status: BookingStatus): Promise<SupportBooking[]>;
    findBySchedule(scheduleId: string): Promise<SupportBooking[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<SupportBooking[]>;
    update(id: string, updateSupportBookingDto: UpdateSupportBookingDto): Promise<SupportBooking>;
    updateStatus(id: string, status: BookingStatus): Promise<SupportBooking>;
    remove(id: string): Promise<void>;
    getBookingStats(): Promise<{
        totalBookings: number;
        pendingBookings: number;
        approvedBookings: number;
        cancelledBookings: number;
    }>;
}
