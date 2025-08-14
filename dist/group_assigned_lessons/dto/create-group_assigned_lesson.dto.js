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
import { IsUUID, IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
export class CreateGroupAssignedLessonDto {
}
__decorate([
    ApiProperty({
        description: 'The UUID of the lesson to be assigned',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedLessonDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the group to assign the lesson to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedLessonDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the user who granted this assignment',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedLessonDto.prototype, "granted_by", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the assigned unit this lesson belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedLessonDto.prototype, "group_assigned_unit_id", void 0);
__decorate([
    ApiProperty({
        description: 'The date when the lesson becomes available',
        example: '2025-07-16'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateGroupAssignedLessonDto.prototype, "start_from", void 0);
__decorate([
    ApiProperty({
        description: 'The date when the lesson access ends',
        example: '2025-08-16'
    }),
    IsDateString(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateGroupAssignedLessonDto.prototype, "end_at", void 0);
__decorate([
    ApiProperty({
        description: 'The status of the lesson',
        enum: ['locked', 'unlocked'],
        example: 'unlocked'
    }),
    IsEnum(['locked', 'unlocked']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedLessonDto.prototype, "status", void 0);
//# sourceMappingURL=create-group_assigned_lesson.dto.js.map