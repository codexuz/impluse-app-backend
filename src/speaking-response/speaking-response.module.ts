import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SpeakingResponseService } from './speaking-response.service.js';
import { SpeakingResponseController } from './speaking-response.controller.js';
import { SpeakingResponse } from './entities/speaking-response.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([SpeakingResponse]),
  ],
  controllers: [SpeakingResponseController],
  providers: [SpeakingResponseService],
  exports: [SpeakingResponseService],
})
export class SpeakingResponseModule {}
