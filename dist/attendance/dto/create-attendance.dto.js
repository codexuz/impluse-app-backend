var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "present";
    AttendanceStatus["ABSENT"] = "absent";
    AttendanceStatus["LATE"] = "late";
})(AttendanceStatus || (AttendanceStatus = {}));
export class CreateAttendanceDto {
}
__decorate([
    ApiProperty({
        description: 'The ID of the group for this attendance record',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The ID of the student for this attendance record',
        example: '987fcdeb-51a2-43d1-9b23-456789012345',
        format: 'uuid'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'The ID of the teacher taking attendance',
        example: 'abc12345-def6-789g-hij0-123456789012',
        format: 'uuid'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'The attendance status of the student',
        example: 'present',
        enum: AttendanceStatus
    }),
    IsEnum(AttendanceStatus),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'Additional notes about the attendance',
        example: 'Student arrived 10 minutes late due to traffic',
        required: false
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "note", void 0);
__decorate([
    ApiProperty({
        description: 'The date of the attendance record (YYYY-MM-DD format)',
        example: '2024-01-15',
        format: 'date'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAttendanceDto.prototype, "date", void 0);
//# sourceMappingURL=create-attendance.dto.js.map