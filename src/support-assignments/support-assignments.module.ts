import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SupportAssignmentsService } from "./support-assignments.service.js";
import { SupportAssignmentsController } from "./support-assignments.controller.js";
import { SupportAssignment } from "./entities/support-assignment.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([SupportAssignment])],
  controllers: [SupportAssignmentsController],
  providers: [SupportAssignmentsService],
  exports: [SupportAssignmentsService],
})
export class SupportAssignmentsModule {}
