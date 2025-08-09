import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service.js';
import { GroupsController } from './groups.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './entities/group.entity.js';
@Module({
  imports: [SequelizeModule.forFeature([Group])], 
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
