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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiConsumes, ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadService } from './upload.service.js';
import { FileUploadDto } from './dto/file-upload.dto.js';
import { Base64UploadDto } from './dto/base64-upload.dto.js';

@ApiTags('Upload')
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
}
