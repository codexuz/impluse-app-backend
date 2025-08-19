import { GroupsService } from './groups.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { Group } from './entities/group.entity.js';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
    create(createGroupDto: CreateGroupDto): Promise<Group>;
    findAll(): Promise<Group[]>;
    findOne(id: string): Promise<Group>;
    findStudents(id: string): Promise<Group>;
    findTeacher(id: string): Promise<Group>;
    findByTeacher(teacherId: string): Promise<Group[]>;
    findByLevel(levelId: string): Promise<Group[]>;
    update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
    remove(id: string): Promise<void>;
}
