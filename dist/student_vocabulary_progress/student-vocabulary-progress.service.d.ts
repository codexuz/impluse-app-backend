import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { CreateStudentVocabularyProgressDto } from './dto/create-student-vocabulary-progress.dto.js';
import { UpdateStudentVocabularyProgressDto } from './dto/update-student-vocabulary-progress.dto.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
export declare class StudentVocabularyProgressService {
    private studentVocabularyProgressModel;
    constructor(studentVocabularyProgressModel: typeof StudentVocabularyProgress);
    create(createDto: CreateStudentVocabularyProgressDto): Promise<StudentVocabularyProgress>;
    findAll(): Promise<StudentVocabularyProgress[]>;
    findOne(id: string): Promise<StudentVocabularyProgress>;
    findByStudent(studentId: string): Promise<StudentVocabularyProgress[]>;
    findByVocabularyItem(vocabularyItemId: string): Promise<StudentVocabularyProgress[]>;
    findByStudentAndVocabularyItem(studentId: string, vocabularyItemId: string): Promise<StudentVocabularyProgress>;
    update(id: string, updateDto: UpdateStudentVocabularyProgressDto): Promise<StudentVocabularyProgress>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: VocabularyProgressStatus): Promise<StudentVocabularyProgress>;
    getStudentProgressStats(studentId: string): Promise<{
        [key in VocabularyProgressStatus]: number;
    }>;
}
