import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VideosService } from './videos.service.js';
import { VideosController } from './videos.controller.js';
import { Video } from './entities/video.entity.js';
import { YoutubeCaptionsModule } from '../services/youtube-captions/youtube-captions.module.js';
@Module({
  imports: [
    YoutubeCaptionsModule,
    SequelizeModule.forFeature([Video])
  ],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}