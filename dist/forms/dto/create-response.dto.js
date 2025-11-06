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
import { IsNotEmpty, IsString, IsObject } from 'class-validator';
export class CreateResponseDto {
}
__decorate([
    ApiProperty({
        description: 'ID of the form being responded to',
        example: "UUID or numeric ID"
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateResponseDto.prototype, "form_id", void 0);
__decorate([
    ApiProperty({
        description: 'The user\'s answers to the form',
        example: {
            name: 'John Doe',
            email: 'john@example.com',
            feedback: 'Great service!'
        }
    }),
    IsNotEmpty(),
    IsObject(),
    __metadata("design:type", Object)
], CreateResponseDto.prototype, "answers", void 0);
//# sourceMappingURL=create-response.dto.js.map