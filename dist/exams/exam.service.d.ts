import { Exam } from './entities/exam.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';
export declare class ExamService {
    private examModel;
    private groupStudentModel;
    constructor(examModel: typeof Exam, groupStudentModel: typeof GroupStudent);
    create(createExamDto: CreateExamDto): Promise<Exam>;
    findAll(): Promise<Exam[]>;
    findOne(id: string): Promise<Exam>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<[number]>;
    remove(id: string): Promise<number>;
    findByGroup(groupId: string): Promise<Exam[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Exam[]>;
    findByStatus(status: string): Promise<Exam[]>;
    findByLevel(level: string): Promise<Exam[]>;
    getByUserId(userId: string): Promise<Exam[]>;
}
