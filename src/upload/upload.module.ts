import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';
@Module({
  controllers: [UploadController],
  providers: [UploadService], 
  exports: [UploadService], // Exporting UploadService if needed in other modules
})
export class UploadModule {}
