import { Module } from '@nestjs/common';
import { YoutubeCaptionsService } from './youtube-captions.service.js';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [YoutubeCaptionsService],
  exports: [YoutubeCaptionsService],
})
export class YoutubeCaptionsModule {}