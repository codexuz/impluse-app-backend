import { CreateTeacherTransactionDto } from './dto/create-teacher-transaction.dto.js';
import { UpdateTeacherTransactionDto } from './dto/update-teacher-transaction.dto.js';
import { TeacherTransaction } from './entities/teacher-transaction.entity.js';
export declare class TeacherTransactionService {
    private teacherTransactionModel;
    constructor(teacherTransactionModel: typeof TeacherTransaction);
    create(createTeacherTransactionDto: CreateTeacherTransactionDto): Promise<TeacherTransaction>;
    findAll(type?: string): Promise<TeacherTransaction[]>;
    findByTeacherId(teacherId: string, type?: string): Promise<TeacherTransaction[]>;
    findOne(id: string): Promise<TeacherTransaction>;
    update(id: string, updateTeacherTransactionDto: UpdateTeacherTransactionDto): Promise<TeacherTransaction>;
    remove(id: string): Promise<void>;
}
