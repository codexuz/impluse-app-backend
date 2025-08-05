import { Module } from '@nestjs/common';
import { YoutubeCaptionsService } from './youtube-captions.service.js';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [YoutubeCaptionsService],
  exports: [YoutubeCaptionsService],
})
export class YoutubeCaptionsModule {}