import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeepseekService } from './deepseek.service.js';

@Module({
  imports: [
    ConfigModule.forRoot(), // This ensures configuration is available
  ],
  providers: [DeepseekService],
  exports: [DeepseekService], // Export the service so it can be used in other modules
})
export class DeepseekModule {}
