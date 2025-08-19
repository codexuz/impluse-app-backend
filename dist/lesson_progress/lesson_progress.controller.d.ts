import { LessonProgressService } from './lesson_progress.service.js';
import { CreateLessonProgressDto } from './dto/create-lesson-progress.dto.js';
import { UpdateLessonProgressDto } from './dto/update-lesson-progress.dto.js';
import { LessonProgress } from './entities/lesson_progress.entity.js';
export declare class LessonProgressController {
    private readonly lessonProgressService;
    constructor(lessonProgressService: LessonProgressService);
    create(createLessonProgressDto: CreateLessonProgressDto): Promise<LessonProgress>;
    findAll(): Promise<LessonProgress[]>;
    findByStudentId(studentId: string): Promise<LessonProgress[]>;
    getStudentOverallProgress(studentId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        inProgressLessons: number;
        overallPercentage: number;
        progressDetails: LessonProgress[];
    }>;
    findByLessonId(lessonId: string): Promise<LessonProgress[]>;
    findByStudentAndLesson(studentId: string, lessonId: string): Promise<LessonProgress>;
    getDetailedProgress(studentId: string, lessonId: string): Promise<{
        progress: LessonProgress | null;
        completedSections: string[];
        remainingSections: string[];
        progressPercentage: number;
    }>;
    updateSectionProgress(studentId: string, lessonId: string, section: string): Promise<LessonProgress>;
    updateFromHomeworkSubmission(studentId: string, homeworkId: string, section: string): Promise<LessonProgress>;
    findOne(id: string): Promise<LessonProgress>;
    update(id: string, updateLessonProgressDto: UpdateLessonProgressDto): Promise<LessonProgress>;
    remove(id: string): Promise<void>;
    getSectionProgressStats(): Promise<{
        reading: {
            completed: number;
            total: number;
            percentage: number;
        };
        listening: {
            completed: number;
            total: number;
            percentage: number;
        };
        grammar: {
            completed: number;
            total: number;
            percentage: number;
        };
        writing: {
            completed: number;
            total: number;
            percentage: number;
        };
        speaking: {
            completed: number;
            total: number;
            percentage: number;
        };
    }>;
    getStudentSectionProgressStats(studentId: string): Promise<{
        reading: {
            completed: number;
            total: number;
            percentage: number;
        };
        listening: {
            completed: number;
            total: number;
            percentage: number;
        };
        grammar: {
            completed: number;
            total: number;
            percentage: number;
        };
        writing: {
            completed: number;
            total: number;
            percentage: number;
        };
        speaking: {
            completed: number;
            total: number;
            percentage: number;
        };
    }>;
    getLessonSectionProgressStats(lessonId: string): Promise<{
        reading: {
            completed: number;
            total: number;
            percentage: number;
        };
        listening: {
            completed: number;
            total: number;
            percentage: number;
        };
        grammar: {
            completed: number;
            total: number;
            percentage: number;
        };
        writing: {
            completed: number;
            total: number;
            percentage: number;
        };
        speaking: {
            completed: number;
            total: number;
            percentage: number;
        };
    }>;
    getAverageSectionProgress(): Promise<{
        reading: number;
        listening: number;
        grammar: number;
        writing: number;
        speaking: number;
        overall: number;
    }>;
    getTopPerformingStudentsBySection(section: string, limit?: string): Promise<{
        section: string;
        students: Array<{
            student_id: string;
            completed_lessons: number;
            total_lessons: number;
            completion_rate: number;
        }>;
    }>;
    getComprehensiveProgressReport(): Promise<{
        overall_stats: {
            total_students: number;
            total_lessons: number;
            average_completion_rate: number;
        };
        section_averages: {
            reading: number;
            listening: number;
            grammar: number;
            writing: number;
            speaking: number;
        };
        completion_distribution: {
            completed_0_20: number;
            completed_21_40: number;
            completed_41_60: number;
            completed_61_80: number;
            completed_81_100: number;
        };
        top_performers: {
            reading: Array<{
                student_id: string;
                completion_rate: number;
            }>;
            listening: Array<{
                student_id: string;
                completion_rate: number;
            }>;
            grammar: Array<{
                student_id: string;
                completion_rate: number;
            }>;
            writing: Array<{
                student_id: string;
                completion_rate: number;
            }>;
            speaking: Array<{
                student_id: string;
                completion_rate: number;
            }>;
        };
    }>;
    getStudentComparisonStats(body: {
        student_ids: string[];
    }): Promise<{
        students: Array<{
            student_id: string;
            reading_progress: number;
            listening_progress: number;
            grammar_progress: number;
            writing_progress: number;
            speaking_progress: number;
            overall_progress: number;
            completed_lessons: number;
            total_lessons: number;
        }>;
        group_averages: {
            reading: number;
            listening: number;
            grammar: number;
            writing: number;
            speaking: number;
            overall: number;
        };
    }>;
    getProgressTrends(days?: string): Promise<{
        daily_progress: Array<{
            date: string;
            new_completions: number;
            cumulative_completions: number;
            average_daily_progress: number;
        }>;
        section_trends: {
            reading: Array<{
                date: string;
                completions: number;
            }>;
            listening: Array<{
                date: string;
                completions: number;
            }>;
            grammar: Array<{
                date: string;
                completions: number;
            }>;
            writing: Array<{
                date: string;
                completions: number;
            }>;
            speaking: Array<{
                date: string;
                completions: number;
            }>;
        };
    }>;
}
