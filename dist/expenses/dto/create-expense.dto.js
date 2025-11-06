var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateExpenseDto {
}
__decorate([
    ApiProperty({
        description: 'Expense title',
        example: 'Office rent payment',
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Expense category ID (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category_id", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Detailed description of the expense',
        example: 'Monthly office rent for December 2025',
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'Expense amount in cents or smallest currency unit',
        example: 500000,
        minimum: 0,
    }),
    IsInt(),
    Min(0),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    ApiProperty({
        description: 'Date when the expense occurred',
        example: '2025-11-06T10:30:00.000Z',
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateExpenseDto.prototype, "expense_date", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Teacher ID if expense is related to a teacher (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "teacher_id", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'User ID who reported/created the expense (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "reported_by", void 0);
//# sourceMappingURL=create-expense.dto.js.map