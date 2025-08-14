import { StudentBookUnit } from './entities/student-book-unit.entity.js';
import { CreateStudentBookUnitDto } from './dto/create-student-book-unit.dto.js';
import { UpdateStudentBookUnitDto } from './dto/update-student-book-unit.dto.js';
export declare class StudentBookUnitsService {
    private studentBookUnitModel;
    constructor(studentBookUnitModel: typeof StudentBookUnit);
    create(createStudentBookUnitDto: CreateStudentBookUnitDto): Promise<StudentBookUnit>;
    findAll(): Promise<StudentBookUnit[]>;
    findOne(id: string): Promise<StudentBookUnit>;
    update(id: string, updateStudentBookUnitDto: UpdateStudentBookUnitDto): Promise<StudentBookUnit>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
