import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamVideoService } from './stream-video.service.js';
import { StreamVideoController } from './stream-video.controller.js';

@Module({
  imports: [ConfigModule],
  controllers: [StreamVideoController],
  providers: [StreamVideoService],
  exports: [StreamVideoService],
})
export class StreamVideoModule {}
