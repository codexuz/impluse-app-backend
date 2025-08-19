import { StudentBookService } from './student-book.service.js';
import { CreateStudentBookDto } from './dto/create-student-book.dto.js';
import { UpdateStudentBookDto } from './dto/update-student-book.dto.js';
export declare class StudentBookController {
    private readonly studentBookService;
    constructor(studentBookService: StudentBookService);
    create(createStudentBookDto: CreateStudentBookDto): Promise<import("./entities/student-book.entity.js").StudentBook>;
    findAll(): Promise<import("./entities/student-book.entity.js").StudentBook[]>;
    findOne(id: string): Promise<import("./entities/student-book.entity.js").StudentBook>;
    findByStudentId(studentId: string): Promise<import("./entities/student-book.entity.js").StudentBook[]>;
    findByStudentAndLevel(studentId: string, levelId: string): Promise<import("./entities/student-book.entity.js").StudentBook[]>;
    update(id: string, updateStudentBookDto: UpdateStudentBookDto): Promise<import("./entities/student-book.entity.js").StudentBook>;
    remove(id: string): Promise<void>;
}
