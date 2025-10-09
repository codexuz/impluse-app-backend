import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CdIeltsService } from './cd-ielts.service.js';
import { CdIeltsController } from './cd-ielts.controller.js';
import { CdIelts } from './entities/cd-ielt.entity.js';
import { CdRegister } from './entities/cd-register.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    SequelizeModule.forFeature([CdIelts, CdRegister, User])
  ],
  controllers: [CdIeltsController],
  providers: [CdIeltsService],
  exports: [CdIeltsService]
})
export class CdIeltsModule {}
