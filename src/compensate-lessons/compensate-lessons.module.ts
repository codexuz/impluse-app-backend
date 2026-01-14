import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CompensateLessonsService } from "./compensate-lessons.service.js";
import { CompensateLessonsController } from "./compensate-lessons.controller.js";
import { CompensateLesson } from "./entities/compensate-lesson.entity.js";
import { CompensateTeacherWallet } from "./entities/compensate-teacher-wallet.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([CompensateLesson, CompensateTeacherWallet]),
  ],
  controllers: [CompensateLessonsController],
  providers: [CompensateLessonsService],
  exports: [CompensateLessonsService],
})
export class CompensateLessonsModule {}
