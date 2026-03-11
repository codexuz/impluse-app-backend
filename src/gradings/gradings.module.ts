import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { GradingsService } from "./gradings.service.js";
import { GradingsController } from "./gradings.controller.js";
import { Grading } from "./entities/grading.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([Grading])],
  controllers: [GradingsController],
  providers: [GradingsService],
  exports: [GradingsService],
})
export class GradingsModule {}
