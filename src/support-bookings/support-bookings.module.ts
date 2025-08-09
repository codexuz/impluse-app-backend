import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupportBookingsService } from './support-bookings.service.js';
import { SupportBookingsController } from './support-bookings.controller.js';
import { SupportBooking } from './entities/support-booking.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([SupportBooking])],
  controllers: [SupportBookingsController],
  providers: [SupportBookingsService],
  exports: [SupportBookingsService],
})
export class SupportBookingsModule {}
