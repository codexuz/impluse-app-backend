import { GroupAssignedUnitsService } from './group_assigned_units.service.js';
import { CreateGroupAssignedUnitDto } from './dto/create-group_assigned_unit.dto.js';
import { UpdateGroupAssignedUnitDto } from './dto/update-group_assigned_unit.dto.js';
import { GroupAssignedUnit } from './entities/group_assigned_unit.entity.js';
export declare class GroupAssignedUnitsController {
    private readonly groupAssignedUnitsService;
    constructor(groupAssignedUnitsService: GroupAssignedUnitsService);
    create(createGroupAssignedUnitDto: CreateGroupAssignedUnitDto): Promise<GroupAssignedUnit>;
    findAll(): Promise<GroupAssignedUnit[]>;
    findByGroupId(groupId: string): Promise<GroupAssignedUnit[]>;
    findOne(id: string): Promise<GroupAssignedUnit>;
    update(id: string, updateGroupAssignedUnitDto: UpdateGroupAssignedUnitDto): Promise<GroupAssignedUnit>;
    remove(id: string): Promise<void>;
}
