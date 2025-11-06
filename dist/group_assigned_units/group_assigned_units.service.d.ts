import { CreateGroupAssignedUnitDto } from "./dto/create-group_assigned_unit.dto.js";
import { UpdateGroupAssignedUnitDto } from "./dto/update-group_assigned_unit.dto.js";
import { GroupAssignedUnit } from "./entities/group_assigned_unit.entity.js";
import { LessonService } from "../lesson/lesson.service.js";
import { GroupAssignedLessonsService } from "../group_assigned_lessons/group_assigned_lessons.service.js";
export declare class GroupAssignedUnitsService {
    private groupAssignedUnitModel;
    private lessonService;
    private groupAssignedLessonsService;
    constructor(groupAssignedUnitModel: typeof GroupAssignedUnit, lessonService: LessonService, groupAssignedLessonsService: GroupAssignedLessonsService);
    create(createDto: CreateGroupAssignedUnitDto): Promise<GroupAssignedUnit>;
    findAll(): Promise<GroupAssignedUnit[]>;
    findOne(id: string): Promise<GroupAssignedUnit>;
    findByGroupId(groupId: string): Promise<GroupAssignedUnit[]>;
    update(id: string, updateDto: UpdateGroupAssignedUnitDto): Promise<GroupAssignedUnit>;
    remove(id: string): Promise<void>;
}
