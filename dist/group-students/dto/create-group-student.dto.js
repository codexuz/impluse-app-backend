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
import { IsUUID, IsNotEmpty, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateGroupStudentDto {
}
__decorate([
    ApiProperty({
        description: 'The UUID of the group',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupStudentDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the student',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupStudentDto.prototype, "student_id", void 0);
__decorate([
    ApiProperty({
        description: 'The date when the student was enrolled',
        example: '2025-07-16T10:00:00Z'
    }),
    Type(() => Date),
    IsDate(),
    IsNotEmpty(),
    __metadata("design:type", Date)
], CreateGroupStudentDto.prototype, "enrolled_at", void 0);
__decorate([
    ApiProperty({
        description: 'The status of the student in the group',
        enum: ['active', 'removed', 'completed', 'frozen'],
        example: 'active'
    }),
    IsEnum(['active', 'removed', 'completed', 'frozen']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupStudentDto.prototype, "status", void 0);
//# sourceMappingURL=create-group-student.dto.js.map