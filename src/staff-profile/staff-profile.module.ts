import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffProfileController } from './staff-profile.controller.js';
import { StaffProfileService } from './staff-profile.service.js';
import { StaffProfile } from './entities/staff-profile.entity.js';
import { StaffShift } from './entities/staff-shift.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([StaffProfile, StaffShift])],
  controllers: [StaffProfileController],
  providers: [StaffProfileService],
  exports: [StaffProfileService],
})
export class StaffProfileModule {}
