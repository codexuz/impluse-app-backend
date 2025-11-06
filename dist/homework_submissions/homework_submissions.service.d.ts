import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import { CreateHomeworkSubmissionDto } from "./dto/create-homework-submission.dto.js";
import { UpdateHomeworkSubmissionDto } from "./dto/update-homework-submission.dto.js";
import { UpdateHomeworkSectionDto } from "./dto/update-homework-section.dto.js";
import { LessonProgressService } from "../lesson_progress/lesson_progress.service.js";
import { SpeakingResponse } from "../speaking-response/entities/speaking-response.entity.js";
import { GroupStudentsService } from "../group-students/group-students.service.js";
import { OpenaiService } from "../services/openai/openai.service.js";
export declare class HomeworkSubmissionsService {
    private homeworkSubmissionModel;
    private homeworkSectionModel;
    private speakingResponseModel;
    private lessonProgressService;
    private groupStudentsService;
    private openaiService;
    constructor(homeworkSubmissionModel: typeof HomeworkSubmission, homeworkSectionModel: typeof HomeworkSection, speakingResponseModel: typeof SpeakingResponse, lessonProgressService: LessonProgressService, groupStudentsService: GroupStudentsService, openaiService: OpenaiService);
    create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<{
        submission: HomeworkSubmission;
        section: HomeworkSection;
    }>;
    findAll(): Promise<HomeworkSubmission[]>;
    findOne(id: string): Promise<HomeworkSubmission>;
    findByHomeworkId(homeworkId: string): Promise<HomeworkSubmission[]>;
    findByStudentId(studentId: string): Promise<HomeworkSubmission[]>;
    findByStudentAndHomework(studentId: string, homeworkId: string): Promise<HomeworkSubmission>;
    update(id: string, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    updateFeedback(id: string, feedback: string): Promise<HomeworkSubmission>;
    updateStatus(id: string, status: string): Promise<HomeworkSubmission>;
    saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<{
        submission: HomeworkSubmission;
        section: HomeworkSection;
    }>;
    private checkAndUpdateAllSectionsCompleted;
    findBySection(section: string): Promise<HomeworkSection[]>;
    findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSection[]>;
    findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSection[]>;
    findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSection>;
    remove(id: string): Promise<void>;
    updateSection(sectionId: string, updateData: UpdateHomeworkSectionDto): Promise<HomeworkSection>;
    getExercisesWithScoresByStudentAndHomework(studentId: string, homeworkId: string, section?: string): Promise<any[]>;
    getStudentHomeworkStatsBySection(studentId: string, startDate?: string, endDate?: string): Promise<{
        overall: number;
        sections: {
            [key: string]: {
                average: number;
                submissions: number;
                trend: number[];
            };
        };
    }>;
    getHomeworkSectionsBySpeakingId(speakingId: string, studentId?: string): Promise<any[]>;
    getStudentAverageSpeakingScore(studentId: string): Promise<number>;
    checkWritingAnswers(sectionId: string, taskType?: string): Promise<HomeworkSection>;
    bulkCheckWritingAnswers(sectionIds: string[], taskType?: string): Promise<Array<{
        sectionId: string;
        success: boolean;
        section?: HomeworkSection;
        error?: string;
    }>>;
    findHomeworksByGroupId(groupId: string): Promise<HomeworkSubmission[]>;
}
