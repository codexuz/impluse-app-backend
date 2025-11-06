import { TeacherTransactionService } from './teacher-transaction.service.js';
import { CreateTeacherTransactionDto } from './dto/create-teacher-transaction.dto.js';
import { UpdateTeacherTransactionDto } from './dto/update-teacher-transaction.dto.js';
export declare class TeacherTransactionController {
    private readonly teacherTransactionService;
    constructor(teacherTransactionService: TeacherTransactionService);
    create(createTeacherTransactionDto: CreateTeacherTransactionDto): Promise<import("./entities/teacher-transaction.entity.js").TeacherTransaction>;
    findAll(type?: string): Promise<import("./entities/teacher-transaction.entity.js").TeacherTransaction[]>;
    findByTeacherId(teacherId: string, type?: string): Promise<import("./entities/teacher-transaction.entity.js").TeacherTransaction[]>;
    findOne(id: string): Promise<import("./entities/teacher-transaction.entity.js").TeacherTransaction>;
    update(id: string, updateTeacherTransactionDto: UpdateTeacherTransactionDto): Promise<import("./entities/teacher-transaction.entity.js").TeacherTransaction>;
    remove(id: string): Promise<void>;
}
