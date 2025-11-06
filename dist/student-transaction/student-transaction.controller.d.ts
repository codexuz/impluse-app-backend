import { StudentTransactionService } from './student-transaction.service.js';
import { CreateStudentTransactionDto } from './dto/create-student-transaction.dto.js';
import { UpdateStudentTransactionDto } from './dto/update-student-transaction.dto.js';
export declare class StudentTransactionController {
    private readonly studentTransactionService;
    constructor(studentTransactionService: StudentTransactionService);
    create(createStudentTransactionDto: CreateStudentTransactionDto): Promise<import("./entities/student-transaction.entity.js").StudentTransaction>;
    findAll(type?: string): Promise<import("./entities/student-transaction.entity.js").StudentTransaction[]>;
    findByStudentId(studentId: string, type?: string): Promise<import("./entities/student-transaction.entity.js").StudentTransaction[]>;
    findOne(id: string): Promise<import("./entities/student-transaction.entity.js").StudentTransaction>;
    update(id: string, updateStudentTransactionDto: UpdateStudentTransactionDto): Promise<import("./entities/student-transaction.entity.js").StudentTransaction>;
    remove(id: string): Promise<void>;
}
