import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherProfileService } from './teacher-profile.service.js';
import { TeacherProfileController } from './teacher-profile.controller.js';
import { TeacherProfile } from './entities/teacher-profile.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([TeacherProfile])],
  controllers: [TeacherProfileController],
  providers: [TeacherProfileService],
  exports: [TeacherProfileService],
})
export class TeacherProfileModule {}
