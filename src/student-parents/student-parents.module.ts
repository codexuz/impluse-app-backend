import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { StudentParentsService } from "./student-parents.service.js";
import { StudentParentsController } from "./student-parents.controller.js";
import { StudentParent } from "./entities/student_parents.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([StudentParent])],
  controllers: [StudentParentsController],
  providers: [StudentParentsService],
  exports: [StudentParentsService],
})
export class StudentParentsModule {}
