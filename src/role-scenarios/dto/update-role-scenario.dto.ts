import { PartialType } from '@nestjs/swagger';
import { CreateRoleScenarioDto } from './create-role-scenario.dto.js';

export class UpdateRoleScenarioDto extends PartialType(CreateRoleScenarioDto) {}
