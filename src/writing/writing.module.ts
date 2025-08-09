import { Module } from '@nestjs/common';
import { WritingService } from './writing.service.js';
import { WritingController } from './writing.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Writing } from './entities/writing.entity.js'; 
@Module({
  imports: [
    SequelizeModule.forFeature([Writing]),
  ],  
  controllers: [WritingController],
  providers: [WritingService],
  exports: [WritingService, SequelizeModule], 
})
export class WritingModule {}
