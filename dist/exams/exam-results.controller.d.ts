import { ExamResultsService } from './exam-results.service.js';
import { CreateExamResultDto } from './dto/create-exam-result.dto.js';
import { UpdateExamResultDto } from './dto/update-exam-result.dto.js';
export declare class ExamResultsController {
    private readonly examResultsService;
    constructor(examResultsService: ExamResultsService);
    create(createExamResultDto: CreateExamResultDto): Promise<import("./entities/exam_result.entity.js").ExamResult>;
    findAll(): Promise<import("./entities/exam_result.entity.js").ExamResult[]>;
    findOne(id: string): Promise<import("./entities/exam_result.entity.js").ExamResult>;
    findByExam(examId: string): Promise<import("./entities/exam_result.entity.js").ExamResult[]>;
    findByStudent(studentId: string): Promise<import("./entities/exam_result.entity.js").ExamResult[]>;
    findByExamAndStudent(examId: string, studentId: string): Promise<import("./entities/exam_result.entity.js").ExamResult>;
    getExamStatistics(examId: string): Promise<{
        totalStudents: number;
        averageScore: number;
        passRate: number;
        sectionAverages: {
            [key: string]: number;
        };
    }>;
    update(id: string, updateExamResultDto: UpdateExamResultDto): Promise<import("./entities/exam_result.entity.js").ExamResult>;
    remove(id: string): Promise<void>;
}
