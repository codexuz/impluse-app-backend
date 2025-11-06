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
export class UploadResponseDto {
}
__decorate([
    ApiProperty({
        description: 'Unique identifier for the upload',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({
        description: 'System generated filename',
        example: 'file_123456789.pdf'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "filename", void 0);
__decorate([
    ApiProperty({
        description: 'Original filename of the uploaded file',
        example: 'document.pdf'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "original_name", void 0);
__decorate([
    ApiProperty({
        description: 'MIME type of the file',
        example: 'application/pdf'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "mime_type", void 0);
__decorate([
    ApiProperty({
        description: 'File size in bytes',
        example: 1024000
    }),
    __metadata("design:type", Number)
], UploadResponseDto.prototype, "file_size", void 0);
__decorate([
    ApiProperty({
        description: 'File path where the file is stored',
        example: '/uploads/2023/10/document.pdf'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "file_path", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'User ID who uploaded the file',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "uploaded_by", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Type of upload',
        example: 'document'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "upload_type", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Description of the uploaded file',
        example: 'Important document for review'
    }),
    __metadata("design:type", String)
], UploadResponseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({
        description: 'Upload timestamp',
        example: '2023-10-26T10:30:00.000Z'
    }),
    __metadata("design:type", Date)
], UploadResponseDto.prototype, "uploaded_at", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Deletion timestamp if file is soft deleted',
        example: null
    }),
    __metadata("design:type", Date)
], UploadResponseDto.prototype, "deleted_at", void 0);
export class FileListItemDto {
}
__decorate([
    ApiProperty({
        description: 'Filename',
        example: 'file_123456789.pdf'
    }),
    __metadata("design:type", String)
], FileListItemDto.prototype, "filename", void 0);
__decorate([
    ApiProperty({
        description: 'Full URL to access the file',
        example: 'https://api.example.com/uploads/file_123456789.pdf'
    }),
    __metadata("design:type", String)
], FileListItemDto.prototype, "url", void 0);
//# sourceMappingURL=upload-response.dto.js.map