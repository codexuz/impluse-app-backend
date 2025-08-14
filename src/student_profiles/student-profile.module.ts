import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentProfile } from './entities/student_profile.entity.js';
import { StudentProfileService } from './student-profile.service.js';
import { StudentProfileController } from './student-profile.controller.js';

@Module({
  imports: [SequelizeModule.forFeature([StudentProfile])],
  controllers: [StudentProfileController],
  providers: [StudentProfileService],
  exports: [StudentProfileService],
})
export class StudentProfileModule {}
