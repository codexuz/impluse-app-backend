var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from "@nestjs/swagger";
export var DayTimeType;
(function (DayTimeType) {
    DayTimeType["ODD"] = "odd";
    DayTimeType["EVEN"] = "even";
    DayTimeType["BOTH"] = "both";
})(DayTimeType || (DayTimeType = {}));
export class LessonScheduleResponseDto {
}
__decorate([
    ApiProperty({
        description: "The unique identifier for the lesson schedule",
        example: "123e4567-e89b-12d3-a456-426614174000",
        format: "uuid",
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: "The ID of the group for this lesson schedule",
        example: "123e4567-e89b-12d3-a456-426614174000",
        format: "uuid",
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: "The group details",
    }),
    __metadata("design:type", Object)
], LessonScheduleResponseDto.prototype, "group", void 0);
__decorate([
    ApiProperty({
        description: "The room number where the lesson will take place",
        example: "Room 101",
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "room_number", void 0);
__decorate([
    ApiProperty({
        description: "The day time pattern (odd weeks, even weeks, or both)",
        example: "both",
        enum: DayTimeType,
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "day_time", void 0);
__decorate([
    ApiProperty({
        description: "The start time of the lesson",
        example: "09:00 AM",
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "start_time", void 0);
__decorate([
    ApiProperty({
        description: "The end time of the lesson",
        example: "10:30 AM",
    }),
    __metadata("design:type", String)
], LessonScheduleResponseDto.prototype, "end_time", void 0);
__decorate([
    ApiProperty({
        description: "When the lesson schedule was created",
        example: "2024-09-10T12:00:00Z",
    }),
    __metadata("design:type", Date)
], LessonScheduleResponseDto.prototype, "created_at", void 0);
__decorate([
    ApiProperty({
        description: "When the lesson schedule was last updated",
        example: "2024-09-10T12:00:00Z",
    }),
    __metadata("design:type", Date)
], LessonScheduleResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=lesson-schedule-response.dto.js.map