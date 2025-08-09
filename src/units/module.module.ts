import { Module } from '@nestjs/common';
import { ModuleService } from './module.service.js';
import { ModuleController } from './module.controller.js';

@Module({
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
