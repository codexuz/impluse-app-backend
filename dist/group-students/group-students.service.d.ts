import { CreateGroupStudentDto } from './dto/create-group-student.dto.js';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto.js';
import { GroupStudent } from './entities/group-student.entity.js';
import { Group } from '../groups/entities/group.entity.js';
export declare class GroupStudentsService {
    private groupStudentModel;
    private groupModel;
    constructor(groupStudentModel: typeof GroupStudent, groupModel: typeof Group);
    create(createDto: CreateGroupStudentDto): Promise<GroupStudent>;
    findAll(): Promise<GroupStudent[]>;
    findOne(id: string): Promise<GroupStudent>;
    findByGroupId(groupId: string): Promise<GroupStudent[]>;
    findByStudentId(studentId: string): Promise<GroupStudent[]>;
    findActiveByGroupId(groupId: string): Promise<GroupStudent[]>;
    update(id: string, updateDto: UpdateGroupStudentDto): Promise<GroupStudent>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<GroupStudent>;
    countStudentsByTeacher(teacherId: string): Promise<number>;
    getStudentsByTeacher(teacherId: string): Promise<GroupStudent[]>;
}
