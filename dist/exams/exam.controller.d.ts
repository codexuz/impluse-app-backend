import { ExamService } from './exam.service.js';
import { CreateExamDto } from './dto/create-exam.dto.js';
import { UpdateExamDto } from './dto/update-exam.dto.js';
export declare class ExamController {
    private readonly examService;
    constructor(examService: ExamService);
    create(createExamDto: CreateExamDto): Promise<import("./entities/exam.entity.js").Exam>;
    findAll(): Promise<import("./entities/exam.entity.js").Exam[]>;
    getByUserId(userId: string): Promise<import("./entities/exam.entity.js").Exam[]>;
    findOne(id: string): Promise<import("./entities/exam.entity.js").Exam>;
    update(id: string, updateExamDto: UpdateExamDto): Promise<[number]>;
    remove(id: string): Promise<number>;
    findByGroup(groupId: string): Promise<import("./entities/exam.entity.js").Exam[]>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./entities/exam.entity.js").Exam[]>;
    findByStatus(status: string): Promise<import("./entities/exam.entity.js").Exam[]>;
    findByLevel(level: string): Promise<import("./entities/exam.entity.js").Exam[]>;
}
