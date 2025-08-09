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
import { IsUUID, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';
export class CreateGroupAssignedUnitDto {
}
__decorate([
    ApiProperty({
        description: 'The status of the unit',
        enum: ['locked', 'unlocked'],
        example: 'unlocked'
    }),
    IsEnum(['locked', 'unlocked']),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedUnitDto.prototype, "status", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the group to assign the unit to',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedUnitDto.prototype, "group_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the unit to be assigned',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedUnitDto.prototype, "unit_id", void 0);
__decorate([
    ApiProperty({
        description: 'The UUID of the teacher assigning the unit',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupAssignedUnitDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'The date when lessons should start',
        example: '2025-08-01',
        required: false
    }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGroupAssignedUnitDto.prototype, "start_date", void 0);
__decorate([
    ApiProperty({
        description: 'The date when lessons should end',
        example: '2025-09-01',
        required: false
    }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGroupAssignedUnitDto.prototype, "end_date", void 0);
//# sourceMappingURL=create-group_assigned_unit.dto.js.map