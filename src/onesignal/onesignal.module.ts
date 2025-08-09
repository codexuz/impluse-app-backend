import { Module } from '@nestjs/common';
import { OnesignalService } from './onesignal.service.js';

@Module({
  providers: [OnesignalService],
  exports: [OnesignalService],
})
export class OnesignalModule {}
