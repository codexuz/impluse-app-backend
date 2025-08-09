import { RoleScenariosService } from './role-scenarios.service.js';
import { CreateRoleScenarioDto } from './dto/create-role-scenario.dto.js';
import { UpdateRoleScenarioDto } from './dto/update-role-scenario.dto.js';
import { RoleScenario } from './entities/role-scenario.entity.js';
export declare class RoleScenariosController {
    private readonly roleScenariosService;
    constructor(roleScenariosService: RoleScenariosService);
    create(createRoleScenarioDto: CreateRoleScenarioDto): Promise<RoleScenario>;
    findAll(): Promise<RoleScenario[]>;
    findOne(id: string): Promise<RoleScenario>;
    findBySpeakingId(speakingId: string): Promise<RoleScenario[]>;
    update(id: string, updateRoleScenarioDto: UpdateRoleScenarioDto): Promise<RoleScenario>;
    remove(id: string): Promise<void>;
}
