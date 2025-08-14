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
    incrementAttempts(id: string): Promise<StudentVocabularyProgress>;
    recordAttempt(studentId: string, vocabularyItemId: string, status?: VocabularyProgressStatus): Promise<StudentVocabularyProgress>;
    getStudentProgressStats(studentId: string): Promise<{
        [key in VocabularyProgressStatus]: number;
    }>;
    getDetailedStudentStats(studentId: string): Promise<{
        totalVocabularyItems: number;
        statusCounts: {
            [key in VocabularyProgressStatus]: number;
        };
        statusPercentages: {
            [key in VocabularyProgressStatus]: number;
        };
        completionRate: number;
        masteryRate: number;
        averageAttempts: number;
        totalAttempts: number;
        recentProgress: StudentVocabularyProgress[];
        learningItems: StudentVocabularyProgress[];
        mostAttemptedItems: StudentVocabularyProgress[];
    }>;
    getVocabularyItemStats(vocabularyItemId: string): Promise<{
        totalStudents: number;
        statusCounts: {
            [key in VocabularyProgressStatus]: number;
        };
        statusPercentages: {
            [key in VocabularyProgressStatus]: number;
        };
        masteryRate: number;
        difficultyScore: number;
        totalAttempts: number;
        averageAttempts: number;
        attemptsToMastery: number;
    }>;
    getGlobalStats(): Promise<{
        totalStudents: number;
        totalVocabularyItems: number;
        totalRecords: number;
        globalStatusCounts: {
            [key in VocabularyProgressStatus]: number;
        };
        globalStatusPercentages: {
            [key in VocabularyProgressStatus]: number;
        };
        globalMasteryRate: number;
        totalAttempts: number;
        averageAttemptsPerItem: number;
        averageAttemptsToMastery: number;
        mostDifficultItems: Array<{
            vocabularyItemId: string;
            difficultyScore: number;
            masteryRate: number;
            averageAttempts: number;
        }>;
        mostMasteredItems: Array<{
            vocabularyItemId: string;
            masteryRate: number;
            totalStudents: number;
            averageAttempts: number;
        }>;
    }>;
    getStudentRankings(limit?: number): Promise<Array<{
        studentId: string;
        totalItems: number;
        masteredItems: number;
        masteryRate: number;
        totalAttempts: number;
        averageAttempts: number;
    }>>;
    getStudentEfficiencyRankings(limit?: number): Promise<Array<{
        studentId: string;
        masteredItems: number;
        averageAttemptsToMastery: number;
        efficiency: number;
    }>>;
    getProgressTrends(days?: number): Promise<{
        dailyProgress: Array<{
            date: string;
            newMasteries: number;
            totalMasteries: number;
            cumulativeMasteryRate: number;
        }>;
        weeklyProgress: Array<{
            weekStart: string;
            newMasteries: number;
            totalMasteries: number;
            masteryRate: number;
        }>;
    }>;
}
