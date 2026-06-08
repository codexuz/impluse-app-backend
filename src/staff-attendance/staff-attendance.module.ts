import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StaffAttendanceController } from './staff-attendance.controller.js';
import { StaffAttendanceService } from './staff-attendance.service.js';
import { StaffAttendance } from './entities/staff-attendance.entity.js';
import { AttendancePolicy } from './entities/attendance-policy.entity.js';
import { StaffAttendanceEvent } from './entities/staff-attendance-event.entity.js';
import { StaffPermission } from './entities/staff-permission.entity.js';
import { StaffProfileModule } from '../staff-profile/staff-profile.module.js';
import { BonusPenaltyModule } from '../bonus-penalty/bonus-penalty.module.js';
import { BonusPenaltyTransaction } from '../bonus-penalty/entities/bonus-penalty-transaction.entity.js';
import { BonusPenaltyWallet } from '../bonus-penalty/entities/bonus-penalty-wallet.entity.js';
import { BonusPenaltyCategory } from '../bonus-penalty/entities/bonus-penalty-category.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([
      StaffAttendance,
      AttendancePolicy,
      StaffAttendanceEvent,
      StaffPermission,
      BonusPenaltyTransaction,
      BonusPenaltyWallet,
      BonusPenaltyCategory,
    ]),
    StaffProfileModule,
    BonusPenaltyModule,
  ],
  controllers: [StaffAttendanceController],
  providers: [StaffAttendanceService],
  exports: [StaffAttendanceService],
})
export class StaffAttendanceModule {}
