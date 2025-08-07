import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeepgramService } from './deepgram.service.js';

@Module({
  imports: [ConfigModule],
  providers: [DeepgramService],
  exports: [DeepgramService],
})
export class DeepgramModule {}
