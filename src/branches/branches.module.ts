import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BranchesService } from "./branches.service.js";
import { BranchesController } from "./branches.controller.js";
import { Branch } from "./entities/branch.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
