import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service.js";
import { GroupsController } from "./groups.controller.js";
import { SequelizeModule } from "@nestjs/sequelize";
import { Group } from "./entities/group.entity.js";
import { Unit } from "../units/entities/units.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { GroupAssignedUnit } from "../group_assigned_units/entities/group_assigned_unit.entity.js";
import { GroupAssignedLesson } from "../group_assigned_lessons/entities/group_assigned_lesson.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Group,
      Unit,
      Lesson,
      GroupAssignedUnit,
      GroupAssignedLesson,
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
