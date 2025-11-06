var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export var TransactionType;
(function (TransactionType) {
    TransactionType["LESSON_WITHDRAWAL"] = "lesson_withdrawal";
    TransactionType["PAYMENT"] = "payment";
    TransactionType["REFUND"] = "refund";
})(TransactionType || (TransactionType = {}));
export class CreateStudentTransactionDto {
}
__decorate([
    ApiProperty({
        description: 'Student ID (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentTransactionDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Transaction amount in cents or smallest currency unit',
        example: 5000,
    }),
    IsInt(),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateStudentTransactionDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        description: 'Type of transaction',
        enum: TransactionType,
        example: TransactionType.PAYMENT,
    }),
    IsEnum(TransactionType),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentTransactionDto.prototype, "type", void 0);
//# sourceMappingURL=create-student-transaction.dto.js.map