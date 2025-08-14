import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleScenariosService } from './role-scenarios.service.js';
import { RoleScenariosController } from './role-scenarios.controller.js';
import { RoleScenario } from './entities/role-scenario.entity.js';

@Module({
  imports: [SequelizeModule.forFeature([RoleScenario])],
  controllers: [RoleScenariosController],
  providers: [RoleScenariosService],
  exports: [RoleScenariosService]
})
export class RoleScenariosModule {}
