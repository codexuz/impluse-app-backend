import { CreateLeadTrialLessonDto } from "./dto/create-lead-trial-lesson.dto.js";
import { UpdateLeadTrialLessonDto } from "./dto/update-lead-trial-lesson.dto.js";
import { LeadTrialLesson } from "./entities/lead-trial-lesson.entity.js";
export declare class LeadTrialLessonsService {
    private trialLessonModel;
    constructor(trialLessonModel: typeof LeadTrialLesson);
    private getIncludeOptions;
    create(createLeadTrialLessonDto: CreateLeadTrialLessonDto): Promise<LeadTrialLesson>;
    findAll(page?: number, limit?: number, search?: string, status?: string, teacherId?: string): Promise<{
        trialLessons: LeadTrialLesson[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    findOne(id: string): Promise<LeadTrialLesson>;
    findByStatus(status: string): Promise<LeadTrialLesson[]>;
    findByTeacher(teacherId: string): Promise<LeadTrialLesson[]>;
    findByLead(leadId: string): Promise<LeadTrialLesson[]>;
    findUpcoming(limit?: number): Promise<LeadTrialLesson[]>;
    update(id: string, updateLeadTrialLessonDto: UpdateLeadTrialLessonDto): Promise<LeadTrialLesson>;
    remove(id: string): Promise<void>;
    getTrialLessonStats(): Promise<{
        totalTrialLessons: number;
        trialLessonsByStatus: {
            [key: string]: number;
        };
        trialLessonsByTeacher: {
            [key: string]: {
                count: number;
                teacherName: string;
            };
        };
        upcomingTrialLessons: number;
    }>;
}
