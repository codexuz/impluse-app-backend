var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingStatus } from './dto/index.js';
import { SupportBooking } from './entities/support-booking.entity.js';
let SupportBookingsService = class SupportBookingsService {
    constructor(supportBookingModel) {
        this.supportBookingModel = supportBookingModel;
    }
    async create(createSupportBookingDto) {
        try {
            const bookingData = {
                ...createSupportBookingDto,
                status: createSupportBookingDto.status || BookingStatus.PENDING,
            };
            const supportBooking = await this.supportBookingModel.create(bookingData);
            return supportBooking;
        }
        catch (error) {
            throw new BadRequestException('Failed to create support booking', error.message);
        }
    }
    async findAll() {
        return this.supportBookingModel.findAll({
            order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
        });
    }
    async findOne(id) {
        const supportBooking = await this.supportBookingModel.findByPk(id);
        if (!supportBooking) {
            throw new NotFoundException(`Support booking with ID ${id} not found`);
        }
        return supportBooking;
    }
    async findByStudent(studentId) {
        return this.supportBookingModel.findAll({
            where: { student_id: studentId },
            order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
        });
    }
    async findByTeacher(teacherId) {
        return this.supportBookingModel.findAll({
            where: { support_teacher_id: teacherId },
            order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
        });
    }
    async findByStatus(status) {
        return this.supportBookingModel.findAll({
            where: { status },
            order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
        });
    }
    async findBySchedule(scheduleId) {
        return this.supportBookingModel.findAll({
            where: { schedule_id: scheduleId },
            order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.supportBookingModel.findAll({
            where: {
                booking_date: {
                    $between: [startDate, endDate],
                },
            },
            order: [['booking_date', 'ASC'], ['start_time', 'ASC']],
        });
    }
    async update(id, updateSupportBookingDto) {
        const supportBooking = await this.findOne(id);
        try {
            await supportBooking.update(updateSupportBookingDto);
            return supportBooking;
        }
        catch (error) {
            throw new BadRequestException('Failed to update support booking', error.message);
        }
    }
    async updateStatus(id, status) {
        const supportBooking = await this.findOne(id);
        try {
            await supportBooking.update({ status });
            return supportBooking;
        }
        catch (error) {
            throw new BadRequestException('Failed to update booking status', error.message);
        }
    }
    async remove(id) {
        const supportBooking = await this.findOne(id);
        await supportBooking.destroy();
    }
    async getBookingStats() {
        const total = await this.supportBookingModel.count();
        const pending = await this.supportBookingModel.count({
            where: { status: BookingStatus.PENDING },
        });
        const approved = await this.supportBookingModel.count({
            where: { status: BookingStatus.APPROVED },
        });
        const cancelled = await this.supportBookingModel.count({
            where: { status: BookingStatus.CANCELLED },
        });
        return {
            totalBookings: total,
            pendingBookings: pending,
            approvedBookings: approved,
            cancelledBookings: cancelled,
        };
    }
};
SupportBookingsService = __decorate([
    Injectable(),
    __param(0, InjectModel(SupportBooking)),
    __metadata("design:paramtypes", [Object])
], SupportBookingsService);
export { SupportBookingsService };
//# sourceMappingURL=support-bookings.service.js.map