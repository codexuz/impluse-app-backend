import { GroupHomeworksService } from './group_homeworks.service.js';
import { CreateGroupHomeworkDto } from './dto/create-group-homework.dto.js';
import { UpdateGroupHomeworkDto } from './dto/update-group_homework.dto.js';
import { GroupHomework } from './entities/group_homework.entity.js';
import { StudentHomeworkStatusDto, GroupHomeworkStatusDto, OverallHomeworkStatsDto } from './dto/homework-status-response.dto.js';
export declare class GroupHomeworksController {
    private readonly groupHomeworksService;
    constructor(groupHomeworksService: GroupHomeworksService);
    create(createGroupHomeworkDto: CreateGroupHomeworkDto): Promise<GroupHomework>;
    findAll(): Promise<GroupHomework[]>;
    findByGroupId(groupId: string): Promise<GroupHomework[]>;
    findByTeacherId(teacherId: string): Promise<GroupHomework[]>;
    findByLessonId(lessonId: string): Promise<GroupHomework[]>;
    findOne(id: string): Promise<GroupHomework>;
    update(id: string, updateGroupHomeworkDto: UpdateGroupHomeworkDto): Promise<GroupHomework>;
    remove(id: string): Promise<void>;
    getHomeworksForUser(userId: string): Promise<any[]>;
    getActiveHomeworksByDate(userId: string): Promise<any[]>;
    getActiveHomeworksBySpecificDate(userId: string, dateString: string): Promise<any[]>;
    getHomeworkWithLessonContent(homeworkId: string): Promise<GroupHomework>;
    getHomeworkStatusByStudent(studentId: string, groupId?: string): Promise<StudentHomeworkStatusDto>;
    getHomeworkStatusByGroup(groupId: string): Promise<GroupHomeworkStatusDto>;
    getOverallHomeworkStats(groupId?: string): Promise<OverallHomeworkStatsDto>;
}
