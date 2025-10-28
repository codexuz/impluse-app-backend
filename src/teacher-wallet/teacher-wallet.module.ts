import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherWalletService } from './teacher-wallet.service.js';
import { TeacherWalletController } from './teacher-wallet.controller.js';
import { TeacherWallet } from './entities/teacher-wallet.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([TeacherWallet])],
  controllers: [TeacherWalletController],
  providers: [TeacherWalletService],
  exports: [TeacherWalletService],
})
export class TeacherWalletModule {}
