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
export class AttendanceResponseDto {
}
__decorate([
    ApiProperty({ description: 'Attendance record ID' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ description: 'Group ID' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({ description: 'Student ID' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({ description: 'Teacher ID' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({ description: 'Attendance status', enum: ['present', 'absent', 'late'] }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ description: 'Additional notes' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ description: 'Date of attendance record' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "date", void 0);
__decorate([
    ApiProperty({ description: 'Record creation timestamp' }),
    __metadata("design:type", Date)
], AttendanceResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty({ description: 'Record last update timestamp' }),
    __metadata("design:type", Date)
], AttendanceResponseDto.prototype, "updatedAt", void 0);
export class AttendanceStatsDto {
}
__decorate([
    ApiProperty({ description: 'Total attendance records' }),
    __metadata("design:type", Number)
], AttendanceStatsDto.prototype, "total", void 0);
__decorate([
    ApiProperty({ description: 'Number of present records' }),
    __metadata("design:type", Number)
], AttendanceStatsDto.prototype, "present", void 0);
__decorate([
    ApiProperty({ description: 'Number of absent records' }),
    __metadata("design:type", Number)
], AttendanceStatsDto.prototype, "absent", void 0);
__decorate([
    ApiProperty({ description: 'Number of late records' }),
    __metadata("design:type", Number)
], AttendanceStatsDto.prototype, "late", void 0);
__decorate([
    ApiProperty({ description: 'Attendance rate percentage' }),
    __metadata("design:type", String)
], AttendanceStatsDto.prototype, "attendanceRate", void 0);
//# sourceMappingURL=attendance-response.dto.js.map