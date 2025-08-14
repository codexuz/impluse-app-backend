import { GroupStudentsService } from './group-students.service.js';
import { CreateGroupStudentDto } from './dto/create-group-student.dto.js';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto.js';
import { GroupStudent } from './entities/group-student.entity.js';
export declare class GroupStudentsController {
    private readonly groupStudentsService;
    constructor(groupStudentsService: GroupStudentsService);
    create(createGroupStudentDto: CreateGroupStudentDto): Promise<GroupStudent>;
    findAll(): Promise<GroupStudent[]>;
    findByGroupId(groupId: string): Promise<GroupStudent[]>;
    findActiveByGroupId(groupId: string): Promise<GroupStudent[]>;
    findByStudentId(studentId: string): Promise<GroupStudent[]>;
    countStudentsByTeacher(teacherId: string): Promise<{
        count: number;
    }>;
    getStudentsByTeacher(teacherId: string): Promise<GroupStudent[]>;
    findOne(id: string): Promise<GroupStudent>;
    update(id: string, updateGroupStudentDto: UpdateGroupStudentDto): Promise<GroupStudent>;
    updateStatus(id: string, status: string): Promise<GroupStudent>;
    remove(id: string): Promise<void>;
}
