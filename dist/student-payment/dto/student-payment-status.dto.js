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
export class StudentPaymentStatusDto {
}
__decorate([
    ApiProperty({
        description: 'Total amount paid by the student',
        example: 1250.00
    }),
    __metadata("design:type", Number)
], StudentPaymentStatusDto.prototype, "totalPaid", void 0);
__decorate([
    ApiProperty({
        description: 'Total amount of pending payments',
        example: 250.00
    }),
    __metadata("design:type", Number)
], StudentPaymentStatusDto.prototype, "pendingAmount", void 0);
__decorate([
    ApiProperty({
        description: 'Current payment status',
        example: 'on_time',
        enum: ['on_time', 'overdue', 'upcoming']
    }),
    __metadata("design:type", String)
], StudentPaymentStatusDto.prototype, "paymentStatus", void 0);
__decorate([
    ApiProperty({
        description: 'Days until next payment is due (negative if overdue)',
        example: 5
    }),
    __metadata("design:type", Number)
], StudentPaymentStatusDto.prototype, "daysUntilNextPayment", void 0);
__decorate([
    ApiProperty({
        description: 'Next payment date',
        example: '2025-08-15'
    }),
    __metadata("design:type", Date)
], StudentPaymentStatusDto.prototype, "nextPaymentDate", void 0);
//# sourceMappingURL=student-payment-status.dto.js.map