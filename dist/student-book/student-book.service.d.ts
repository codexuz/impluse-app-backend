import { StudentBook } from './entities/student-book.entity.js';
import { CreateStudentBookDto } from './dto/create-student-book.dto.js';
import { UpdateStudentBookDto } from './dto/update-student-book.dto.js';
import { User } from '../users/entities/user.entity.js';
export declare class StudentBookService {
    private studentBookModel;
    private userModel;
    constructor(studentBookModel: typeof StudentBook, userModel: typeof User);
    create(createStudentBookDto: CreateStudentBookDto): Promise<StudentBook>;
    findAll(): Promise<StudentBook[]>;
    findOne(id: string): Promise<StudentBook>;
    findByStudentId(studentId: string): Promise<StudentBook[]>;
    findByStudentAndLevel(studentId: string, levelId: string): Promise<StudentBook[]>;
    update(id: string, updateStudentBookDto: UpdateStudentBookDto): Promise<StudentBook>;
    remove(id: string): Promise<void>;
}
