import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleScenarioDto } from './dto/create-role-scenario.dto.js';
import { UpdateRoleScenarioDto } from './dto/update-role-scenario.dto.js';
import { RoleScenario } from './entities/role-scenario.entity.js';

@Injectable()
export class RoleScenariosService {
  constructor(
    @InjectModel(RoleScenario)
    private roleScenarioModel: typeof RoleScenario,
  ) {}

  async create(createRoleScenarioDto: CreateRoleScenarioDto): Promise<RoleScenario> {
    return this.roleScenarioModel.create({ ...createRoleScenarioDto });
  }

  async findAll(): Promise<RoleScenario[]> {
    return this.roleScenarioModel.findAll();
  }

  async findOne(id: string): Promise<RoleScenario> {
    const roleScenario = await this.roleScenarioModel.findByPk(id);
    if (!roleScenario) {
      throw new NotFoundException('Role scenario not found');
    }
    return roleScenario;
  }

  async findBySpeakingId(speakingId: string): Promise<RoleScenario[]> {
    return this.roleScenarioModel.findAll({
      where: { speaking_id: speakingId }
    });
  }

  async update(id: string, updateRoleScenarioDto: UpdateRoleScenarioDto): Promise<RoleScenario> {
    const roleScenario = await this.findOne(id);
    await roleScenario.update(updateRoleScenarioDto);
    return roleScenario;
  }

  async remove(id: string): Promise<void> {
    const roleScenario = await this.findOne(id);
    await roleScenario.destroy();
  }
}
  

