import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSupportBookingDto, UpdateSupportBookingDto, BookingStatus } from './dto/index.js';
import { SupportBooking } from './entities/support-booking.entity.js';

@Injectable()
export class SupportBookingsService {
  constructor(
    @InjectModel(SupportBooking)
    private supportBookingModel: typeof SupportBooking,
  ) {}

  async create(createSupportBookingDto: CreateSupportBookingDto): Promise<SupportBooking> {
    try {
      // Set default status if not provided
      const bookingData = {
        ...createSupportBookingDto,
        status: createSupportBookingDto.status || BookingStatus.PENDING,
      };
      
      const supportBooking = await this.supportBookingModel.create(bookingData);
      return supportBooking;
    } catch (error) {
      throw new BadRequestException('Failed to create support booking', error.message);
    }
  }

  async findAll(): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
  }

  async findOne(id: string): Promise<SupportBooking> {
    const supportBooking = await this.supportBookingModel.findByPk(id);
    if (!supportBooking) {
      throw new NotFoundException(`Support booking with ID ${id} not found`);
    }
    return supportBooking;
  }

  async findByStudent(studentId: string): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      where: { student_id: studentId },
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
  }

  async findByTeacher(teacherId: string): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      where: { support_teacher_id: teacherId },
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
  }

  async findByStatus(status: BookingStatus): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      where: { status },
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
  }

  async findBySchedule(scheduleId: string): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      where: { schedule_id: scheduleId },
      order: [['booking_date', 'DESC'], ['start_time', 'ASC']],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<SupportBooking[]> {
    return this.supportBookingModel.findAll({
      where: {
        booking_date: {
          $between: [startDate, endDate],
        },
      },
      order: [['booking_date', 'ASC'], ['start_time', 'ASC']],
    });
  }

  async update(id: string, updateSupportBookingDto: UpdateSupportBookingDto): Promise<SupportBooking> {
    const supportBooking = await this.findOne(id);
    
    try {
      await supportBooking.update(updateSupportBookingDto);
      return supportBooking;
    } catch (error) {
      throw new BadRequestException('Failed to update support booking', error.message);
    }
  }

  async updateStatus(id: string, status: BookingStatus): Promise<SupportBooking> {
    const supportBooking = await this.findOne(id);
    
    try {
      await supportBooking.update({ status });
      return supportBooking;
    } catch (error) {
      throw new BadRequestException('Failed to update booking status', error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const supportBooking = await this.findOne(id);
    await supportBooking.destroy();
  }

  async getBookingStats(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    cancelledBookings: number;
  }> {
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
}
