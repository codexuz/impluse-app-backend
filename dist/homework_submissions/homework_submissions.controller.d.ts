import { HomeworkSubmissionsService } from './homework_submissions.service.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
export declare class HomeworkSubmissionsController {
    private readonly homeworkSubmissionsService;
    constructor(homeworkSubmissionsService: HomeworkSubmissionsService);
    create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    findAll(): Promise<HomeworkSubmission[]>;
    findByHomework(homeworkId: string): Promise<HomeworkSubmission[]>;
    findByStudent(studentId: string): Promise<HomeworkSubmission[]>;
    findByStudentAndHomework(studentId: string, homeworkId: string): Promise<HomeworkSubmission>;
    findBySection(section: string): Promise<HomeworkSubmission[]>;
    findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSubmission[]>;
    findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSubmission[]>;
    findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSubmission>;
    findOne(id: string): Promise<HomeworkSubmission>;
    update(id: string, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    updateFeedback(id: string, feedback: string): Promise<HomeworkSubmission>;
    updateStatus(id: string, status: string): Promise<HomeworkSubmission>;
    remove(id: string): Promise<void>;
}
