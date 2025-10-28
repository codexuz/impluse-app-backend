import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentWalletService } from './student-wallet.service.js';
import { StudentWalletController } from './student-wallet.controller.js';
import { StudentWallet } from './entities/student-wallet.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([StudentWallet])],
  controllers: [StudentWalletController],
  providers: [StudentWalletService],
  exports: [StudentWalletService],
})
export class StudentWalletModule {}
