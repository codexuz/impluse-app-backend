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
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';
export class CreateGroupDto {
}
__decorate([
    ApiProperty({
        description: 'The name of the group',
        example: 'Advanced English 101'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "name", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the teacher assigned to the group',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "teacher_id", void 0);
__decorate([
    ApiProperty({
        description: 'UUID of the level assigned to the group',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateGroupDto.prototype, "level_id", void 0);
//# sourceMappingURL=create-group.dto.js.map