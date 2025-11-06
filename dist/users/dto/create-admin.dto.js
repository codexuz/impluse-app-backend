var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsNotEmpty, IsOptional, MinLength, } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
export class CreateAdminDto {
}
__decorate([
    ApiProperty({
        description: "Username for login",
        example: "admin_user",
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "username", void 0);
__decorate([
    ApiProperty({
        description: "Password for the admin account",
        minLength: 6,
        example: "admin123456",
    }),
    IsString(),
    MinLength(6),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
__decorate([
    ApiProperty({
        description: "Admin's first name",
        example: "Admin",
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "first_name", void 0);
__decorate([
    ApiProperty({
        description: "Admin's last name",
        example: "User",
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "last_name", void 0);
__decorate([
    ApiPropertyOptional({
        description: "Admin's phone number with country code",
        example: "+1234567890",
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional({
        description: "Admin's avatar URL",
        example: "https://example.com/avatar.jpg",
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "avatar_url", void 0);
//# sourceMappingURL=create-admin.dto.js.map