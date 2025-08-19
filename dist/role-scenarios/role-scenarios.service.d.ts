import { CreateRoleScenarioDto } from './dto/create-role-scenario.dto.js';
import { UpdateRoleScenarioDto } from './dto/update-role-scenario.dto.js';
import { RoleScenario } from './entities/role-scenario.entity.js';
export declare class RoleScenariosService {
    private roleScenarioModel;
    constructor(roleScenarioModel: typeof RoleScenario);
    create(createRoleScenarioDto: CreateRoleScenarioDto): Promise<RoleScenario>;
    findAll(): Promise<RoleScenario[]>;
    findOne(id: string): Promise<RoleScenario>;
    findBySpeakingId(speakingId: string): Promise<RoleScenario[]>;
    update(id: string, updateRoleScenarioDto: UpdateRoleScenarioDto): Promise<RoleScenario>;
    remove(id: string): Promise<void>;
}
