import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service.js';
import { OpenaiController } from './openai.controller.js';
import { ConfigModule } from '@nestjs/config';

@Module({
 imports: [
    ConfigModule.forRoot()
 ],
  controllers: [OpenaiController],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
