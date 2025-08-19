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
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsDateString } from 'class-validator';
export var TrialLessonStatus;
(function (TrialLessonStatus) {
    TrialLessonStatus["BELGILANGAN"] = "belgilangan";
    TrialLessonStatus["KELDI"] = "keldi";
    TrialLessonStatus["KELMADI"] = "kelmadi";
})(TrialLessonStatus || (TrialLessonStatus = {}));
export class CreateLeadTrialLessonDto {
}
__decorate([
    ApiProperty({
        description: 'Scheduled date and time for the trial lesson',
        example: '2024-01-20T14:00:00Z'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateLeadTrialLessonDto.prototype, "scheduledAt", void 0);
__decorate([
    ApiProperty({
        description: 'Trial lesson status',
        enum: TrialLessonStatus,
        example: TrialLessonStatus.BELGILANGAN
    }),
    IsEnum(TrialLessonStatus),
    __metadata("design:type", String)
], CreateLeadTrialLessonDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Teacher ID assigned to the trial lesson',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadTrialLessonDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'Lead ID for the trial lesson',
        example: '123e4567-e89b-12d3-a456-426614174001'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadTrialLessonDto.prototype, "lead_id", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes about the trial lesson',
        example: 'Student is interested in business English'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLeadTrialLessonDto.prototype, "notes", void 0);
//# sourceMappingURL=create-lead-trial-lesson.dto.js.map