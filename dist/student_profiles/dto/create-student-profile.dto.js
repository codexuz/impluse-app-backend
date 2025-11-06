var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStudentProfileDto {
    constructor() {
        this.points = 0;
        this.coins = 0;
        this.streaks = 0;
    }
}
__decorate([
    ApiProperty({
        description: 'The UUID of the user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateStudentProfileDto.prototype, "user_id", void 0);
__decorate([
    ApiProperty({
        description: 'Achievement points of the student',
        example: 0,
        minimum: 0,
        default: 0
    }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateStudentProfileDto.prototype, "points", void 0);
__decorate([
    ApiProperty({
        description: 'Virtual currency earned by the student',
        example: 0,
        minimum: 0,
        default: 0
    }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateStudentProfileDto.prototype, "coins", void 0);
__decorate([
    ApiProperty({
        description: 'Number of consecutive days of activity',
        example: 0,
        minimum: 0,
        default: 0
    }),
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateStudentProfileDto.prototype, "streaks", void 0);
//# sourceMappingURL=create-student-profile.dto.js.map