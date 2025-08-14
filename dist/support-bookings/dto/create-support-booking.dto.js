var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';
export var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["APPROVED"] = "approved";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (BookingStatus = {}));
export class CreateSupportBookingDto {
}
__decorate([
    ApiProperty({
        description: 'Support teacher ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSupportBookingDto.prototype, "support_teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'Student ID who is booking the support session',
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSupportBookingDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Schedule ID for the support session',
        example: '123e4567-e89b-12d3-a456-426614174002'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateSupportBookingDto.prototype, "schedule_id", void 0);
__decorate([
    ApiProperty({
        description: 'Booking date',
        example: '2024-01-25T00:00:00Z'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateSupportBookingDto.prototype, "booking_date", void 0);
__decorate([
    ApiProperty({
        description: 'Start time for the support session',
        example: '2024-01-25T14:00:00Z'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateSupportBookingDto.prototype, "start_time", void 0);
__decorate([
    ApiProperty({
        description: 'End time for the support session',
        example: '2024-01-25T15:30:00Z'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateSupportBookingDto.prototype, "end_time", void 0);
__decorate([
    ApiProperty({
        description: 'Booking status',
        enum: BookingStatus,
        example: BookingStatus.PENDING,
        default: BookingStatus.PENDING
    }),
    IsEnum(BookingStatus),
    IsOptional(),
    __metadata("design:type", String)
], CreateSupportBookingDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes for the booking',
        example: 'Need help with grammar exercises',
        required: false
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateSupportBookingDto.prototype, "notes", void 0);
//# sourceMappingURL=create-support-booking.dto.js.map