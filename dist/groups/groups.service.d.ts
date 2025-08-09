import { CreateGroupDto } from './dto/create-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { Group } from './entities/group.entity.js';
export declare class GroupsService {
    private groupModel;
    constructor(groupModel: typeof Group);
    create(createGroupDto: CreateGroupDto): Promise<Group>;
    findAll(): Promise<Group[]>;
    findOne(id: string): Promise<Group>;
    findAllStudentsInGroup(id: string): Promise<Group>;
    findTeacherOfGroup(id: string): Promise<Group>;
    findByTeacherId(teacherId: string): Promise<Group[]>;
    findByLevelId(levelId: string): Promise<Group[]>;
    update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group>;
    remove(id: string): Promise<void>;
}
