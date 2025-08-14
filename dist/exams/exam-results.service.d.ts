import { ExamResult } from './entities/exam_result.entity.js';
import { CreateExamResultDto } from './dto/create-exam-result.dto.js';
import { UpdateExamResultDto } from './dto/update-exam-result.dto.js';
import { Exam } from './entities/exam.entity.js';
export declare class ExamResultsService {
    private examResultModel;
    private examModel;
    constructor(examResultModel: typeof ExamResult, examModel: typeof Exam);
    create(createExamResultDto: CreateExamResultDto): Promise<ExamResult>;
    findAll(): Promise<ExamResult[]>;
    findOne(id: string): Promise<ExamResult>;
    findByExam(examId: string): Promise<ExamResult[]>;
    findByStudent(studentId: string): Promise<ExamResult[]>;
    findByExamAndStudent(examId: string, studentId: string): Promise<ExamResult>;
    update(id: string, updateExamResultDto: UpdateExamResultDto): Promise<ExamResult>;
    remove(id: string): Promise<void>;
    getExamStatistics(examId: string): Promise<{
        totalStudents: number;
        averageScore: number;
        passRate: number;
        sectionAverages: {
            [key: string]: number;
        };
    }>;
}
