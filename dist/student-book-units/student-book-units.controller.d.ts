import { StudentBookUnitsService } from './student-book-units.service.js';
import { CreateStudentBookUnitDto } from './dto/create-student-book-unit.dto.js';
import { UpdateStudentBookUnitDto } from './dto/update-student-book-unit.dto.js';
export declare class StudentBookUnitsController {
    private readonly studentBookUnitsService;
    constructor(studentBookUnitsService: StudentBookUnitsService);
    create(createStudentBookUnitDto: CreateStudentBookUnitDto): Promise<import("./entities/student-book-unit.entity.js").StudentBookUnit>;
    findAll(): Promise<import("./entities/student-book-unit.entity.js").StudentBookUnit[]>;
    findOne(id: string): Promise<import("./entities/student-book-unit.entity.js").StudentBookUnit>;
    update(id: string, updateStudentBookUnitDto: UpdateStudentBookUnitDto): Promise<import("./entities/student-book-unit.entity.js").StudentBookUnit>;
    remove(id: string): Promise<{
        id: string;
    }>;
}
