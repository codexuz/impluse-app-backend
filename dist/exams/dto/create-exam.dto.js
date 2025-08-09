var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsUUID, IsDate, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export var ExamStatus;
(function (ExamStatus) {
    ExamStatus["SCHEDULED"] = "scheduled";
    ExamStatus["COMPLETED"] = "completed";
    ExamStatus["CANCELLED"] = "cancelled";
})(ExamStatus || (ExamStatus = {}));
export var ExamLevel;
(function (ExamLevel) {
    ExamLevel["BEGINNER"] = "beginner";
    ExamLevel["ELEMETARY"] = "elementary";
    ExamLevel["PRE_INTERMEDIATE"] = "pre-intermediate";
    ExamLevel["INTERMEDIATE"] = "intermediate";
})(ExamLevel || (ExamLevel = {}));
export class CreateExamDto {
    constructor() {
        this.status = ExamStatus.SCHEDULED;
        this.is_online = false;
        this.level = ExamLevel.BEGINNER;
    }
}
__decorate([
    ApiProperty({
        description: 'The title of the exam',
        example: 'Final English Test'
    }),
    IsString(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the group taking the exam',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The scheduled date and time of the exam',
        example: '2025-07-20T14:00:00Z'
    }),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], CreateExamDto.prototype, "scheduled_at", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'The status of the exam',
        enum: ExamStatus,
        default: ExamStatus.SCHEDULED,
        example: ExamStatus.SCHEDULED
    }),
    IsEnum(ExamStatus),
    IsOptional(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Whether the exam is conducted online',
        default: false,
        example: false
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateExamDto.prototype, "is_online", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'The difficulty level of the exam',
        enum: ExamLevel,
        default: ExamLevel.BEGINNER,
        example: ExamLevel.BEGINNER
    }),
    IsEnum(ExamLevel),
    IsOptional(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "level", void 0);
//# sourceMappingURL=create-exam.dto.js.map