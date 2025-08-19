var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
}
__decorate([
    ApiProperty({
        description: 'Username for authentication',
        example: 'john_doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    ApiProperty({
        description: 'User password',
        minLength: 6,
        example: 'password123'
    }),
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
export class RegisterDto {
}
__decorate([
    ApiProperty({
        description: 'User phone number with country code',
        example: '+1234567890'
    }),
    IsString(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    ApiProperty({
        description: 'Unique username for the account',
        example: 'john_doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    ApiProperty({
        description: 'Password for the account',
        minLength: 6,
        example: 'password123'
    }),
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    ApiProperty({
        description: 'User\'s first name',
        example: 'John'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDto.prototype, "first_name", void 0);
__decorate([
    ApiProperty({
        description: 'User\'s last name',
        example: 'Doe'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], RegisterDto.prototype, "last_name", void 0);
export class JwtPayload {
}
__decorate([
    ApiProperty({
        description: 'User ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], JwtPayload.prototype, "sub", void 0);
__decorate([
    ApiProperty({
        description: 'Username',
        example: 'john_doe'
    }),
    __metadata("design:type", String)
], JwtPayload.prototype, "username", void 0);
__decorate([
    ApiProperty({
        description: 'Phone number',
        example: '+1234567890'
    }),
    __metadata("design:type", String)
], JwtPayload.prototype, "phone", void 0);
__decorate([
    ApiProperty({
        description: 'Current session ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    __metadata("design:type", String)
], JwtPayload.prototype, "sessionId", void 0);
__decorate([
    ApiProperty({
        description: 'User roles',
        example: ['student'],
        type: [String]
    }),
    __metadata("design:type", Array)
], JwtPayload.prototype, "roles", void 0);
__decorate([
    ApiProperty({
        description: 'User permissions',
        example: ['read:profile', 'update:profile'],
        type: [String]
    }),
    __metadata("design:type", Array)
], JwtPayload.prototype, "permissions", void 0);
__decorate([
    ApiProperty({
        description: 'Token issued at timestamp',
        example: 1625097600,
        required: false
    }),
    __metadata("design:type", Number)
], JwtPayload.prototype, "iat", void 0);
__decorate([
    ApiProperty({
        description: 'Token expiration timestamp',
        example: 1625184000,
        required: false
    }),
    __metadata("design:type", Number)
], JwtPayload.prototype, "exp", void 0);
//# sourceMappingURL=auth.dto.js.map