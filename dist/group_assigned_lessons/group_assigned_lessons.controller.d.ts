import { GroupAssignedLessonsService } from './group_assigned_lessons.service.js';
import { CreateGroupAssignedLessonDto } from './dto/create-group_assigned_lesson.dto.js';
import { UpdateGroupAssignedLessonDto } from './dto/update-group_assigned_lesson.dto.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';
export declare class GroupAssignedLessonsController {
    private readonly groupAssignedLessonsService;
    constructor(groupAssignedLessonsService: GroupAssignedLessonsService);
    create(createGroupAssignedLessonDto: CreateGroupAssignedLessonDto): Promise<GroupAssignedLesson>;
    findAll(): Promise<GroupAssignedLesson[]>;
    findByGroupId(groupId: string): Promise<GroupAssignedLesson[]>;
    findByUnitId(unitId: string): Promise<GroupAssignedLesson[]>;
    findOne(id: string): Promise<GroupAssignedLesson>;
    update(id: string, updateGroupAssignedLessonDto: UpdateGroupAssignedLessonDto): Promise<GroupAssignedLesson>;
    remove(id: string): Promise<void>;
}
