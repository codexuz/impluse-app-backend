import { PartialType } from '@nestjs/swagger';
import { CreateSupportBookingDto } from './create-support-booking.dto.js';

export class UpdateSupportBookingDto extends PartialType(CreateSupportBookingDto) {}
