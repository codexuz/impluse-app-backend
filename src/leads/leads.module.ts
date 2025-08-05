import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadsService } from './leads.service.js';
import { LeadsController } from './leads.controller.js';
import { Lead } from './entities/lead.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([Lead])],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService, SequelizeModule]
})
export class LeadsModule {}
