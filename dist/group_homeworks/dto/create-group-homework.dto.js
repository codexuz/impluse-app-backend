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
import { IsString, IsUUID, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
export class CreateGroupHomeworkDto {
}
__decorate([
    ApiProperty({
        description: 'The UUID of the lesson this homework is for',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupHomeworkDto.prototype, "lesson_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the group to assign the homework to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupHomeworkDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the teacher assigning the homework',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupHomeworkDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'The title of the homework',
        example: 'Grammar Exercise - Past Simple'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupHomeworkDto.prototype, "title", void 0);
__decorate([
    ApiProperty({
        description: 'The start date for the homework (YYYY-MM-DD)',
        example: '2025-07-15'
    }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGroupHomeworkDto.prototype, "start_date", void 0);
__decorate([
    ApiProperty({
        description: 'The deadline for the homework (YYYY-MM-DD)',
        example: '2025-08-01'
    }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGroupHomeworkDto.prototype, "deadline", void 0);
//# sourceMappingURL=create-group-homework.dto.js.map