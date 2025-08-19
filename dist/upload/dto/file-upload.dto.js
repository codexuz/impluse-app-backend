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
export class FileUploadDto {
}
__decorate([
    ApiProperty({ example: 'original-filename.pdf' }),
    __metadata("design:type", String)
], FileUploadDto.prototype, "originalName", void 0);
__decorate([
    ApiProperty({ example: 'file-1234567890.pdf' }),
    __metadata("design:type", String)
], FileUploadDto.prototype, "filename", void 0);
__decorate([
    ApiProperty({ example: 'uploads/file-1234567890.pdf' }),
    __metadata("design:type", String)
], FileUploadDto.prototype, "path", void 0);
__decorate([
    ApiProperty({ example: 'http://localhost:3000/uploads/file-1234567890.pdf' }),
    __metadata("design:type", String)
], FileUploadDto.prototype, "url", void 0);
//# sourceMappingURL=file-upload.dto.js.map