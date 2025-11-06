import { HomeworkSubmissionsService } from "./homework_submissions.service.js";
import { CreateHomeworkSubmissionDto } from "./dto/create-homework-submission.dto.js";
import { UpdateHomeworkSubmissionDto } from "./dto/update-homework-submission.dto.js";
import { UpdateHomeworkSectionDto } from "./dto/update-homework-section.dto.js";
import { HomeworkSubmission } from "./entities/homework_submission.entity.js";
import { HomeworkSection } from "./entities/homework_sections.entity.js";
import { HomeworkSubmissionWithSectionResponseDto } from "./dto/homework-submission-response.dto.js";
export declare class HomeworkSubmissionsController {
    private readonly homeworkSubmissionsService;
    constructor(homeworkSubmissionsService: HomeworkSubmissionsService);
    create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmissionWithSectionResponseDto>;
    saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmissionWithSectionResponseDto>;
    findAll(): Promise<HomeworkSubmission[]>;
    findByHomework(homeworkId: string): Promise<HomeworkSubmission[]>;
    findByStudent(studentId: string): Promise<HomeworkSubmission[]>;
    findByGroup(groupId: string): Promise<HomeworkSubmission[]>;
    findByStudentAndHomework(studentId: string, homeworkId: string): Promise<HomeworkSubmission>;
    findBySection(section: string): Promise<HomeworkSection[]>;
    findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSection[]>;
    findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSection[]>;
    findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSection>;
    findOne(id: string): Promise<HomeworkSubmission>;
    update(id: string, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    updateFeedback(id: string, feedback: string): Promise<HomeworkSubmission>;
    updateStatus(id: string, status: string): Promise<HomeworkSubmission>;
    updateSection(sectionId: string, updateData: UpdateHomeworkSectionDto): Promise<HomeworkSection>;
    checkWritingAnswers(sectionId: string, taskType?: string): Promise<HomeworkSection>;
    bulkCheckWritingAnswers(requestBody: {
        sectionIds: string[];
        taskType?: string;
    }): Promise<Array<{
        sectionId: string;
        success: boolean;
        section?: HomeworkSection;
        error?: string;
    }>>;
    remove(id: string): Promise<void>;
    getExercisesWithScores(studentId: string, homeworkId: string, section?: string): Promise<any[]>;
    getStudentHomeworkStats(studentId: string, startDate?: string, endDate?: string): Promise<any>;
    getStudentAverageSpeakingScore(studentId: string): Promise<number>;
    getHomeworkSectionsBySpeaking(speakingId: string, studentId?: string): Promise<any[]>;
}
