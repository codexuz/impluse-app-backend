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
import { IsString, IsNotEmpty } from 'class-validator';
export class Base64UploadDto {
}
__decorate([
    ApiProperty({
        description: 'Base64 encoded file content',
        example: '9j/4AAQSkZJRgABAQEASABIAAD/...'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], Base64UploadDto.prototype, "base64Data", void 0);
__decorate([
    ApiProperty({
        description: 'Filename to use for the saved file (optional)',
        example: 'my-image.jpg',
        required: false
    }),
    IsString(),
    __metadata("design:type", String)
], Base64UploadDto.prototype, "filename", void 0);
//# sourceMappingURL=base64-upload.dto.js.map