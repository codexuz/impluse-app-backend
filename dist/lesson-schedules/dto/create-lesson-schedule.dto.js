var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export var DayTimeType;
(function (DayTimeType) {
    DayTimeType["ODD"] = "odd";
    DayTimeType["EVEN"] = "even";
    DayTimeType["BOTH"] = "both";
})(DayTimeType || (DayTimeType = {}));
export class CreateLessonScheduleDto {
}
__decorate([
    ApiProperty({
        description: "The ID of the group for this lesson schedule",
        example: "123e4567-e89b-12d3-a456-426614174000",
        format: "uuid",
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLessonScheduleDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: "The room number where the lesson will take place",
        example: "Room 101",
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLessonScheduleDto.prototype, "room_number", void 0);
__decorate([
    ApiProperty({
        description: "The day time pattern (odd weeks, even weeks, or both)",
        example: "both",
        enum: DayTimeType,
    }),
    IsEnum(DayTimeType),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateLessonScheduleDto.prototype, "day_time", void 0);
__decorate([
    ApiProperty({
        description: "The start time of the lesson (Date format)",
        example: "2025-09-13T09:00:00Z",
        required: false,
    }),
    IsOptional(),
    __metadata("design:type", Date)
], CreateLessonScheduleDto.prototype, "start_time", void 0);
__decorate([
    ApiProperty({
        description: "The end time of the lesson (Date format)",
        example: "2025-09-13T10:30:00Z",
        required: false,
    }),
    IsOptional(),
    __metadata("design:type", Date)
], CreateLessonScheduleDto.prototype, "end_time", void 0);
//# sourceMappingURL=create-lesson-schedule.dto.js.map