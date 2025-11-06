import { CreateGroupHomeworkDto } from "./dto/create-group-homework.dto.js";
import { UpdateGroupHomeworkDto } from "./dto/update-group_homework.dto.js";
import { GroupHomework } from "./entities/group_homework.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { Lesson } from "../lesson/entities/lesson.entity.js";
import { Exercise } from "../exercise/entities/exercise.entity.js";
import { Speaking } from "../speaking/entities/speaking.entity.js";
import { LessonContent } from "../lesson-content/entities/lesson-content.entity.js";
import { LessonVocabularySet } from "../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js";
import { HomeworkSubmission } from "../homework_submissions/entities/homework_submission.entity.js";
export declare class GroupHomeworksService {
    private groupHomeworkModel;
    private groupStudentModel;
    private lessonModel;
    private exerciseModel;
    private speakingModel;
    private lessonContentModel;
    private lessonVocabularySetModel;
    private homeworkSubmissionModel;
    constructor(groupHomeworkModel: typeof GroupHomework, groupStudentModel: typeof GroupStudent, lessonModel: typeof Lesson, exerciseModel: typeof Exercise, speakingModel: typeof Speaking, lessonContentModel: typeof LessonContent, lessonVocabularySetModel: typeof LessonVocabularySet, homeworkSubmissionModel: typeof HomeworkSubmission);
    create(createDto: CreateGroupHomeworkDto): Promise<GroupHomework>;
    findAll(): Promise<GroupHomework[]>;
    findOne(id: string): Promise<GroupHomework>;
    findByGroupId(groupId: string): Promise<GroupHomework[]>;
    findByTeacherId(teacherId: string): Promise<GroupHomework[]>;
    findByLessonId(lessonId: string): Promise<GroupHomework[]>;
    update(id: string, updateDto: UpdateGroupHomeworkDto): Promise<GroupHomework>;
    remove(id: string): Promise<void>;
    getHomeworksForUser(userId: string): Promise<any[]>;
    getActiveHomeworksByDate(userId: string, date?: Date): Promise<any[]>;
    getHomeworkWithLessonContent(homeworkId: string): Promise<GroupHomework>;
    getHomeworkStatusByStudent(studentId: string, groupId?: string): Promise<{
        studentId: string;
        groupId: string;
        summary: {
            total: number;
            finished: number;
            unfinished: number;
            overdue: number;
        };
        finishedHomeworks: any[];
        unfinishedHomeworks: any[];
    }>;
    getHomeworkStatusByGroup(groupId: string): Promise<{
        groupId: string;
        studentCount: number;
        summary: {
            totalHomeworks: number;
            overdueHomeworks: number;
        };
        homeworks: any[];
    }>;
    getOverallHomeworkStats(groupId?: string): Promise<{
        groupId: string;
        totalHomeworks: number;
        overdueHomeworks: number;
        upcomingHomeworks: number;
        noDeadlineHomeworks: number;
    }>;
}
