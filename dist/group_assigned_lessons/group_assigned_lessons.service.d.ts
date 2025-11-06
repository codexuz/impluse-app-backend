import { CreateGroupAssignedLessonDto } from './dto/create-group_assigned_lesson.dto.js';
import { UpdateGroupAssignedLessonDto } from './dto/update-group_assigned_lesson.dto.js';
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';
export declare class GroupAssignedLessonsService {
    private groupAssignedLessonModel;
    constructor(groupAssignedLessonModel: typeof GroupAssignedLesson);
    create(createGroupAssignedLessonDto: CreateGroupAssignedLessonDto): Promise<GroupAssignedLesson>;
    findAll(): Promise<GroupAssignedLesson[]>;
    findOne(id: string): Promise<GroupAssignedLesson>;
    findByGroupId(groupId: string): Promise<GroupAssignedLesson[]>;
    findByUnitId(unitId: string): Promise<GroupAssignedLesson[]>;
    update(id: string, updateGroupAssignedLessonDto: UpdateGroupAssignedLessonDto): Promise<GroupAssignedLesson>;
    remove(id: string): Promise<void>;
}
