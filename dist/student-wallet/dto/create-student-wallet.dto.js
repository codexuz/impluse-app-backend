var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStudentWalletDto {
}
__decorate([
    ApiProperty({
        description: 'Student ID (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentWalletDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'Wallet amount in cents or smallest currency unit',
        example: 10000,
        minimum: 0,
    }),
    IsInt(),
    Min(0),
    IsNotEmpty(),
    __metadata("design:type", Number)
], CreateStudentWalletDto.prototype, "amount", void 0);
//# sourceMappingURL=create-student-wallet.dto.js.map