var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNumber, IsEnum, IsDate, IsNotEmpty, Min, IsString, IsOptional, } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus, PaymentMethod } from "./create-student-payment.dto.js";
export class CreateStudentPaymentRequestDto {
}
__decorate([
    ApiProperty({
        description: "The ID of the student",
        example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentPaymentRequestDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: "The amount of the payment",
        example: 100.5,
    }),
    IsNumber(),
    Min(0),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateStudentPaymentRequestDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        enum: PaymentStatus,
        example: PaymentStatus.COMPLETED,
        description: "Payment status",
    }),
    IsEnum(PaymentStatus),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentPaymentRequestDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        enum: PaymentMethod,
        example: PaymentMethod.CASH,
        description: "Method of payment",
    }),
    IsEnum(PaymentMethod),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentPaymentRequestDto.prototype, "payment_method", void 0);
__decorate([
    ApiProperty({
        example: new Date(),
        description: "Date when payment was made",
    }),
    Type(() => Date),
    IsDate(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateStudentPaymentRequestDto.prototype, "payment_date", void 0);
__decorate([
    ApiProperty({
        example: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: "Due date for next payment",
    }),
    Type(() => Date),
    IsDate(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateStudentPaymentRequestDto.prototype, "next_payment_date", void 0);
__decorate([
    ApiProperty({
        description: "Additional notes about the payment",
        example: "First month payment",
        required: false,
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateStudentPaymentRequestDto.prototype, "notes", void 0);
//# sourceMappingURL=create-student-payment-request.dto.js.map