var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, UploadedFile, UseInterceptors, Get, Delete, Param, Body, Patch, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam, } from "@nestjs/swagger";
import { UploadService } from "./upload.service.js";
import { FileUploadDto } from "./dto/file-upload.dto.js";
import { Base64UploadDto } from "./dto/base64-upload.dto.js";
import { CreateUploadDto } from "./dto/create-upload.dto.js";
import { UpdateUploadDto } from "./dto/update-upload.dto.js";
import { UploadResponseDto, } from "./dto/upload-response.dto.js";
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadFile(file) {
        const fileUrl = this.uploadService.getFileUrl(file.filename);
        return {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            url: fileUrl,
        };
    }
    async getAllFiles() {
        return this.uploadService.getAllFiles();
    }
    async deleteFile(filename) {
        return this.uploadService.deleteFile(filename);
    }
    async uploadBase64File(base64UploadDto) {
        return this.uploadService.saveBase64File(base64UploadDto.base64Data, base64UploadDto.filename);
    }
    async createUploadRecord(createUploadDto) {
        return this.uploadService.create(createUploadDto);
    }
    async getAllUploadRecords() {
        return this.uploadService.findAll();
    }
    async getUploadRecord(id) {
        return this.uploadService.findOne(id);
    }
    async getUploadsByUser(userId) {
        return this.uploadService.findByUploadedBy(userId);
    }
    async getUploadsByType(uploadType) {
        return this.uploadService.findByType(uploadType);
    }
    async updateUploadRecord(id, updateUploadDto) {
        return this.uploadService.update(id, updateUploadDto);
    }
    async deleteUploadRecord(id) {
        return this.uploadService.remove(id);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: "Upload a file" }),
    ApiConsumes("multipart/form-data"),
    ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    ApiResponse({
        status: 201,
        description: "File uploaded successfully",
        type: FileUploadDto,
    }),
    ApiResponse({
        status: 413,
        description: "File too large",
    }),
    UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads",
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: { fileSize: 1024 * 1024 * 1024 },
    })),
    __param(0, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadFile", null);
__decorate([
    Get(),
    ApiOperation({ summary: "Get all uploaded files" }),
    ApiResponse({ status: 200, description: "List of all files" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getAllFiles", null);
__decorate([
    Delete(":filename"),
    ApiOperation({ summary: "Delete a file" }),
    ApiResponse({ status: 200, description: "File deleted successfully" }),
    ApiResponse({ status: 404, description: "File not found" }),
    __param(0, Param("filename")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteFile", null);
__decorate([
    Post("base64"),
    ApiOperation({ summary: "Upload a base64 encoded file" }),
    ApiBody({ type: Base64UploadDto }),
    ApiResponse({
        status: 201,
        description: "Base64 file saved successfully",
        type: FileUploadDto,
    }),
    ApiResponse({
        status: 400,
        description: "Invalid base64 format or processing error",
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Base64UploadDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadBase64File", null);
__decorate([
    Post("records"),
    ApiOperation({ summary: "Create upload record in database" }),
    ApiBody({ type: CreateUploadDto }),
    ApiResponse({
        status: 201,
        description: "Upload record created successfully",
        type: UploadResponseDto,
    }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUploadDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "createUploadRecord", null);
__decorate([
    Get("records"),
    ApiOperation({ summary: "Get all upload records from database" }),
    ApiResponse({
        status: 200,
        description: "List of all upload records",
        type: [UploadResponseDto],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getAllUploadRecords", null);
__decorate([
    Get("records/:id"),
    ApiOperation({ summary: "Get upload record by ID" }),
    ApiParam({ name: "id", description: "Upload ID" }),
    ApiResponse({
        status: 200,
        description: "Upload record found",
        type: UploadResponseDto,
    }),
    ApiResponse({ status: 404, description: "Upload record not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getUploadRecord", null);
__decorate([
    Get("records/user/:userId"),
    ApiOperation({ summary: "Get upload records by user ID" }),
    ApiParam({ name: "userId", description: "User ID" }),
    ApiResponse({
        status: 200,
        description: "Upload records found for user",
        type: [UploadResponseDto],
    }),
    __param(0, Param("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getUploadsByUser", null);
__decorate([
    Get("records/type/:uploadType"),
    ApiOperation({ summary: "Get upload records by type" }),
    ApiParam({
        name: "uploadType",
        description: "Upload type (audio, image, document, etc.)",
    }),
    ApiResponse({
        status: 200,
        description: "Upload records found for type",
        type: [UploadResponseDto],
    }),
    __param(0, Param("uploadType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getUploadsByType", null);
__decorate([
    Patch("records/:id"),
    ApiOperation({ summary: "Update upload record" }),
    ApiParam({ name: "id", description: "Upload ID" }),
    ApiBody({ type: UpdateUploadDto }),
    ApiResponse({
        status: 200,
        description: "Upload record updated successfully",
        type: UploadResponseDto,
    }),
    ApiResponse({ status: 404, description: "Upload record not found" }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUploadDto]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "updateUploadRecord", null);
__decorate([
    Delete("records/:id"),
    ApiOperation({ summary: "Delete upload record (soft delete)" }),
    ApiParam({ name: "id", description: "Upload ID" }),
    ApiResponse({
        status: 200,
        description: "Upload record deleted successfully",
    }),
    ApiResponse({ status: 404, description: "Upload record not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "deleteUploadRecord", null);
UploadController = __decorate([
    ApiTags("Upload"),
    Controller("upload"),
    __metadata("design:paramtypes", [UploadService])
], UploadController);
export { UploadController };
//# sourceMappingURL=upload.controller.js.map