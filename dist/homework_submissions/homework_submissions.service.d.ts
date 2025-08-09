import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { CreateHomeworkSubmissionDto } from './dto/create-homework-submission.dto.js';
import { UpdateHomeworkSubmissionDto } from './dto/update-homework-submission.dto.js';
import { LessonProgressService } from '../lesson_progress/lesson_progress.service.js';
export declare class HomeworkSubmissionsService {
    private homeworkSubmissionModel;
    private lessonProgressService;
    constructor(homeworkSubmissionModel: typeof HomeworkSubmission, lessonProgressService: LessonProgressService);
    create(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    findAll(): Promise<HomeworkSubmission[]>;
    findOne(id: string): Promise<HomeworkSubmission>;
    findByHomeworkId(homeworkId: string): Promise<HomeworkSubmission[]>;
    findByStudentId(studentId: string): Promise<HomeworkSubmission[]>;
    findByStudentAndHomework(studentId: string, homeworkId: string): Promise<HomeworkSubmission>;
    update(id: string, updateHomeworkSubmissionDto: UpdateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    updateFeedback(id: string, feedback: string): Promise<HomeworkSubmission>;
    updateStatus(id: string, status: string): Promise<HomeworkSubmission>;
    saveBySection(createHomeworkSubmissionDto: CreateHomeworkSubmissionDto): Promise<HomeworkSubmission>;
    findBySection(section: string): Promise<HomeworkSubmission[]>;
    findByStudentAndSection(studentId: string, section: string): Promise<HomeworkSubmission[]>;
    findByHomeworkAndSection(homeworkId: string, section: string): Promise<HomeworkSubmission[]>;
    findByStudentHomeworkAndSection(studentId: string, homeworkId: string, section: string): Promise<HomeworkSubmission>;
    remove(id: string): Promise<void>;
}
