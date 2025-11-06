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
    updateStatusByVocabularyItemId(vocabularyItemId: string, status: VocabularyProgressStatus): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[]>;
    getStudentStats(studentId: string): Promise<{
        learning: number;
        reviewing: number;
        mastered: number;
    }>;
    getDetailedStudentStats(studentId: string): Promise<{
        totalVocabularyItems: number;
        statusCounts: { [key in VocabularyProgressStatus]: number; };
        statusPercentages: { [key in VocabularyProgressStatus]: number; };
        completionRate: number;
        masteryRate: number;
        averageAttempts: number;
        totalAttempts: number;
        recentProgress: import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[];
        learningItems: import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[];
        mostAttemptedItems: import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress[];
    }>;
    getVocabularyItemStats(vocabularyItemId: string): Promise<{
        totalStudents: number;
        statusCounts: { [key in VocabularyProgressStatus]: number; };
        statusPercentages: { [key in VocabularyProgressStatus]: number; };
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
        globalStatusCounts: { [key in VocabularyProgressStatus]: number; };
        globalStatusPercentages: { [key in VocabularyProgressStatus]: number; };
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
    getStudentRankings(limitParam?: string): Promise<{
        studentId: string;
        totalItems: number;
        masteredItems: number;
        masteryRate: number;
        totalAttempts: number;
        averageAttempts: number;
    }[]>;
    getStudentEfficiencyRankings(limitParam?: string): Promise<{
        studentId: string;
        masteredItems: number;
        averageAttemptsToMastery: number;
        efficiency: number;
    }[]>;
    getProgressTrends(daysParam?: string): Promise<{
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
    incrementAttempts(id: string): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    recordAttempt(studentId: string, vocabularyItemId: string, status?: VocabularyProgressStatus): Promise<import("./entities/student_vocabulary_progress.entity.js").StudentVocabularyProgress>;
    remove(id: string): Promise<void>;
}
