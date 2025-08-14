import { Module } from '@nestjs/common';
import { GroupStudentsService } from './group-students.service.js';
import { GroupStudentsController } from './group-students.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '../groups/entities/group.entity.js';
import { GroupStudent } from './entities/group-student.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([Group, GroupStudent])],
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
  exports: [GroupStudentsService],
})
export class GroupStudentsModule {}
