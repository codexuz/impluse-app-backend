import { StudentVocabularyProgressService } from './student-vocabulary-progress.service.js';
import { CreateStudentVocabularyProgressDto } from './dto/create-student-vocabulary-progress.dto.js';
import { UpdateStudentVocabularyProgressDto } from './dto/update-student-vocabulary-progress.dto.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
export declare class StudentVocabularyProgressController {
    private readonly progressService;
    constructor(progressService: StudentVocabularyProgressService);
    create(createDto: CreateStudentVocabularyProgressDto): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    findAll(): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[]>;
    findOne(id: string): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    findByStudent(studentId: string): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[]>;
    findByVocabularyItem(vocabularyItemId: string): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[]>;
    findByStudentAndVocabularyItem(studentId: string, vocabularyItemId: string): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    update(id: string, updateDto: UpdateStudentVocabularyProgressDto): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    updateStatus(id: string, status: VocabularyProgressStatus): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    getStudentStats(studentId: string): Promise<{
        learning: number;
        reviewing: number;
        mastered: number;
    }>;
    remove(id: string): Promise<void>;
}
