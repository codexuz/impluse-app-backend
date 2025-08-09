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
export class DuePaymentItemDto {
}
__decorate([
    ApiProperty({
        description: 'Payment ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    __metadata("design:type", String)
], DuePaymentItemDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'Student ID',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    __metadata("design:type", String)
], DuePaymentItemDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Payment amount',
        example: 250.00
    }),
    __metadata("design:type", Number)
], DuePaymentItemDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        description: 'Original payment date',
        example: '2025-06-29'
    }),
    __metadata("design:type", Date)
], DuePaymentItemDto.prototype, "payment_date", void 0);
__decorate([
    ApiProperty({
        description: 'Next payment date that has passed',
        example: '2025-07-29'
    }),
    __metadata("design:type", Date)
], DuePaymentItemDto.prototype, "next_payment_date", void 0);
__decorate([
    ApiProperty({
        description: 'Payment method',
        example: 'Naqd',
        enum: ['Naqd', 'Karta', 'Click', 'Payme']
    }),
    __metadata("design:type", String)
], DuePaymentItemDto.prototype, "payment_method", void 0);
__decorate([
    ApiProperty({
        description: 'Whether a new payment record would be created',
        example: true
    }),
    __metadata("design:type", Boolean)
], DuePaymentItemDto.prototype, "would_create_new_payment", void 0);
__decorate([
    ApiProperty({
        description: 'New payment date that will be set for the new record',
        example: '2025-07-29'
    }),
    __metadata("design:type", Date)
], DuePaymentItemDto.prototype, "new_payment_date", void 0);
__decorate([
    ApiProperty({
        description: 'New next payment date that will be set for the new record',
        example: '2025-08-29'
    }),
    __metadata("design:type", Date)
], DuePaymentItemDto.prototype, "new_next_payment_date", void 0);
export class DuePaymentsResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Number of payments with passed next_payment_date',
        example: 3
    }),
    __metadata("design:type", Number)
], DuePaymentsResponseDto.prototype, "count", void 0);
__decorate([
    ApiProperty({
        description: 'List of payments that would be processed',
        type: [DuePaymentItemDto]
    }),
    __metadata("design:type", Array)
], DuePaymentsResponseDto.prototype, "payments", void 0);
//# sourceMappingURL=due-payments.dto.js.map