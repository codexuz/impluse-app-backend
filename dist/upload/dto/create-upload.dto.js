var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
export var UploadType;
(function (UploadType) {
    UploadType["AUDIO"] = "audio";
    UploadType["IMAGE"] = "image";
    UploadType["DOCUMENT"] = "document";
    UploadType["VIDEO"] = "video";
    UploadType["OTHER"] = "other";
})(UploadType || (UploadType = {}));
export class CreateUploadDto {
}
__decorate([
    ApiProperty({
        description: 'Original filename of the uploaded file',
        example: 'document.pdf'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "original_name", void 0);
__decorate([
    ApiProperty({
        description: 'MIME type of the file',
        example: 'application/pdf'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "mime_type", void 0);
__decorate([
    ApiProperty({
        description: 'File size in bytes',
        example: 1024000
    }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateUploadDto.prototype, "file_size", void 0);
__decorate([
    ApiProperty({
        description: 'File path where the file is stored',
        example: '/uploads/2023/10/document.pdf'
    }),
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "file_path", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'User ID who uploaded the file',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "uploaded_by", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Type of upload',
        enum: UploadType,
        example: UploadType.DOCUMENT
    }),
    IsEnum(UploadType),
    IsOptional(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "upload_type", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Description of the uploaded file',
        example: 'Important document for review'
    }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateUploadDto.prototype, "description", void 0);
//# sourceMappingURL=create-upload.dto.js.map