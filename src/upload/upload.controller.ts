// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Body,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service.js';
import { FileUploadDto } from './dto/file-upload.dto.js';
import { Base64UploadDto } from './dto/base64-upload.dto.js';
import { CreateUploadDto } from './dto/create-upload.dto.js';
import { UpdateUploadDto } from './dto/update-upload.dto.js';
import { UploadResponseDto, FileListItemDto } from './dto/upload-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: FileUploadDto
  })
  @ApiResponse({
    status: 413,
    description: 'File too large',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // or use dynamic path logic
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = this.uploadService.getFileUrl(file.filename);
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      url: fileUrl,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all uploaded files' })
  @ApiResponse({ status: 200, description: 'List of all files' })
  async getAllFiles() {
    return this.uploadService.getAllFiles();
  }

  @Delete(':filename')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async deleteFile(@Param('filename') filename: string) {
    return this.uploadService.deleteFile(filename);
  }
  
  @Post('base64')
  @ApiOperation({ summary: 'Upload a base64 encoded file' })
  @ApiBody({ type: Base64UploadDto })
  @ApiResponse({
    status: 201,
    description: 'Base64 file saved successfully',
    type: FileUploadDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid base64 format or processing error',
  })
  async uploadBase64File(@Body() base64UploadDto: Base64UploadDto) {
    return this.uploadService.saveBase64File(
      base64UploadDto.base64Data, 
      base64UploadDto.filename
    );
  }

  // Database operations
  @Post('records')
  @ApiOperation({ summary: 'Create upload record in database' })
  @ApiBody({ type: CreateUploadDto })
  @ApiResponse({
    status: 201,
    description: 'Upload record created successfully',
    type: UploadResponseDto
  })
  async createUploadRecord(@Body() createUploadDto: CreateUploadDto): Promise<UploadResponseDto> {
    return this.uploadService.create(createUploadDto);
  }

  @Get('records')
  @ApiOperation({ summary: 'Get all upload records from database' })
  @ApiResponse({
    status: 200,
    description: 'List of all upload records',
    type: [UploadResponseDto]
  })
  async getAllUploadRecords(): Promise<UploadResponseDto[]> {
    return this.uploadService.findAll();
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'Get upload record by ID' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiResponse({
    status: 200,
    description: 'Upload record found',
    type: UploadResponseDto
  })
  @ApiResponse({ status: 404, description: 'Upload record not found' })
  async getUploadRecord(@Param('id') id: string): Promise<UploadResponseDto> {
    return this.uploadService.findOne(id);
  }

  @Get('records/user/:userId')
  @ApiOperation({ summary: 'Get upload records by user ID' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Upload records found for user',
    type: [UploadResponseDto]
  })
  async getUploadsByUser(@Param('userId') userId: string): Promise<UploadResponseDto[]> {
    return this.uploadService.findByUploadedBy(userId);
  }

  @Get('records/type/:uploadType')
  @ApiOperation({ summary: 'Get upload records by type' })
  @ApiParam({ name: 'uploadType', description: 'Upload type (audio, image, document, etc.)' })
  @ApiResponse({
    status: 200,
    description: 'Upload records found for type',
    type: [UploadResponseDto]
  })
  async getUploadsByType(@Param('uploadType') uploadType: string): Promise<UploadResponseDto[]> {
    return this.uploadService.findByType(uploadType);
  }

  @Patch('records/:id')
  @ApiOperation({ summary: 'Update upload record' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiBody({ type: UpdateUploadDto })
  @ApiResponse({
    status: 200,
    description: 'Upload record updated successfully',
    type: UploadResponseDto
  })
  @ApiResponse({ status: 404, description: 'Upload record not found' })
  async updateUploadRecord(
    @Param('id') id: string,
    @Body() updateUploadDto: UpdateUploadDto
  ): Promise<UploadResponseDto> {
    return this.uploadService.update(id, updateUploadDto);
  }

  @Delete('records/:id')
  @ApiOperation({ summary: 'Delete upload record (soft delete)' })
  @ApiParam({ name: 'id', description: 'Upload ID' })
  @ApiResponse({
    status: 200,
    description: 'Upload record deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Upload record not found' })
  async deleteUploadRecord(@Param('id') id: string): Promise<void> {
    return this.uploadService.remove(id);
  }
}
