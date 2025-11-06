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
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateCdIeltDto {
}
__decorate([
    ApiProperty({ description: 'The title of the IELTS test', example: 'IELTS Academic Test - October 2025' }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateCdIeltDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'Status of the IELTS test',
        enum: ['active', 'full', 'inactive'],
        example: 'active'
    }),
    IsNotEmpty(),
    IsEnum(['active', 'full', 'inactive']),
    __metadata("design:type", String)
], CreateCdIeltDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'The date of the IELTS test',
        example: '2025-10-15'
    }),
    IsNotEmpty(),
    IsDateString(),
    __metadata("design:type", Date)
], CreateCdIeltDto.prototype, "exam_date", void 0);
__decorate([
    ApiProperty({
        description: 'The time of the IELTS test',
        example: '09:00 AM'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateCdIeltDto.prototype, "time", void 0);
__decorate([
    ApiProperty({
        description: 'The location of the IELTS test',
        example: 'British Council Test Center, 123 Main St'
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateCdIeltDto.prototype, "location", void 0);
__decorate([
    ApiProperty({
        description: 'Number of available seats for the test',
        example: 30
    }),
    IsNotEmpty(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateCdIeltDto.prototype, "seats", void 0);
__decorate([
    ApiProperty({
        description: 'The price of the IELTS test',
        example: 250.00
    }),
    IsNotEmpty(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateCdIeltDto.prototype, "price", void 0);
//# sourceMappingURL=create-cd-ielt.dto.js.map