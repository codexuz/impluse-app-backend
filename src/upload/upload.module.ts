import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';
import { Upload } from './entities/upload.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([Upload])
  ],
  controllers: [UploadController],
  providers: [UploadService], 
  exports: [UploadService], // Exporting UploadService if needed in other modules
})
export class UploadModule {}
