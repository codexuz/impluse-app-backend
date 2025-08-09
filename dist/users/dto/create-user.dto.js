var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUserDto {
}
__decorate([
    ApiProperty({
        description: 'Username for login',
        example: 'john_doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    ApiProperty({
        description: 'Password for the user account',
        minLength: 6,
        example: 'password123'
    }),
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    ApiProperty({
        description: 'User\'s first name',
        example: 'John'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "first_name", void 0);
__decorate([
    ApiProperty({
        description: 'User\'s last name',
        example: 'Doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "last_name", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'User\'s phone number with country code',
        example: '+1234567890'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Whether the user account is active',
        default: true
    }),
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "is_active", void 0);
//# sourceMappingURL=create-user.dto.js.map