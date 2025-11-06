import { CreateStudentTransactionDto } from './dto/create-student-transaction.dto.js';
import { UpdateStudentTransactionDto } from './dto/update-student-transaction.dto.js';
import { StudentTransaction } from './entities/student-transaction.entity.js';
export declare class StudentTransactionService {
    private studentTransactionModel;
    constructor(studentTransactionModel: typeof StudentTransaction);
    create(createStudentTransactionDto: CreateStudentTransactionDto): Promise<StudentTransaction>;
    findAll(type?: string): Promise<StudentTransaction[]>;
    findByStudentId(studentId: string, type?: string): Promise<StudentTransaction[]>;
    findOne(id: string): Promise<StudentTransaction>;
    update(id: string, updateStudentTransactionDto: UpdateStudentTransactionDto): Promise<StudentTransaction>;
    remove(id: string): Promise<void>;
}
