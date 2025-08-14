import { LeadTrialLessonsService } from './lead-trial-lessons.service.js';
import { CreateLeadTrialLessonDto } from './dto/create-lead-trial-lesson.dto.js';
import { UpdateLeadTrialLessonDto } from './dto/update-lead-trial-lesson.dto.js';
export declare class LeadTrialLessonsController {
    private readonly leadTrialLessonsService;
    constructor(leadTrialLessonsService: LeadTrialLessonsService);
    create(createLeadTrialLessonDto: CreateLeadTrialLessonDto): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson>;
    findAll(page?: number, limit?: number, search?: string, status?: string, teacherId?: string): Promise<{
        trialLessons: import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getStats(): Promise<{
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
    findUpcoming(limit?: number): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[]>;
    findByStatus(status: string): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[]>;
    findByTeacher(teacherId: string): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[]>;
    findByLead(leadId: string): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[]>;
    getMyLessons(user: any): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson[]>;
    findOne(id: string): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson>;
    update(id: string, updateLeadTrialLessonDto: UpdateLeadTrialLessonDto): Promise<import("./entities/lead-trial-lesson.entity.js").LeadTrialLesson>;
    remove(id: string): Promise<void>;
}
