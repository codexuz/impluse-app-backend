import { Module } from '@nestjs/common';
import { SpeechifyService } from './speechify.service.js';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SpeechifyService],
  exports: [SpeechifyService],
})
export class SpeechifyModule {}
