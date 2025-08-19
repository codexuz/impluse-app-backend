import { SupportBookingsService } from './support-bookings.service.js';
import { CreateSupportBookingDto, UpdateSupportBookingDto, BookingStatus } from './dto/index.js';
export declare class SupportBookingsController {
    private readonly supportBookingsService;
    constructor(supportBookingsService: SupportBookingsService);
    create(createSupportBookingDto: CreateSupportBookingDto): Promise<import("./entities/support-booking.entity.js").SupportBooking>;
    findAll(): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    findByStudent(studentId: string): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    findByStatus(status: BookingStatus): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    findBySchedule(scheduleId: string): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./entities/support-booking.entity.js").SupportBooking[]>;
    getStats(): Promise<{
        totalBookings: number;
        pendingBookings: number;
        approvedBookings: number;
        cancelledBookings: number;
    }>;
    findOne(id: string): Promise<import("./entities/support-booking.entity.js").SupportBooking>;
    update(id: string, updateSupportBookingDto: UpdateSupportBookingDto): Promise<import("./entities/support-booking.entity.js").SupportBooking>;
    updateStatus(id: string, status: BookingStatus): Promise<import("./entities/support-booking.entity.js").SupportBooking>;
    remove(id: string): Promise<void>;
}
