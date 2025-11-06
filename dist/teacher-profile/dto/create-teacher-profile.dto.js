var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNotEmpty, IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export var PaymentType;
(function (PaymentType) {
    PaymentType["PERCENTAGE"] = "percentage";
    PaymentType["FIXED"] = "fixed";
})(PaymentType || (PaymentType = {}));
export class CreateTeacherProfileDto {
}
__decorate([
    ApiProperty({
        description: 'User ID (UUID) of the teacher',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateTeacherProfileDto.prototype, "user_id", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Payment type for the teacher',
        enum: PaymentType,
        example: PaymentType.PERCENTAGE,
    }),
    IsEnum(PaymentType),
    IsOptional(),
    __metadata("design:type", String)
], CreateTeacherProfileDto.prototype, "payment_type", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Payment value (percentage 0-100 or fixed amount)',
        example: 50,
    }),
    IsInt(),
    IsOptional(),
    __metadata("design:type", Number)
], CreateTeacherProfileDto.prototype, "payment_value", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Day of the month for payment (1-31)',
        example: 15,
        minimum: 1,
        maximum: 31,
    }),
    IsInt(),
    Min(1),
    Max(31),
    IsOptional(),
    __metadata("design:type", Number)
], CreateTeacherProfileDto.prototype, "payment_day", void 0);
//# sourceMappingURL=create-teacher-profile.dto.js.map