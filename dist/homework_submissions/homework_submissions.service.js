var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomeworkSubmission } from './entities/homework_submission.entity.js';
import { LessonProgressService } from '../lesson_progress/lesson_progress.service.js';
let HomeworkSubmissionsService = class HomeworkSubmissionsService {
    constructor(homeworkSubmissionModel, lessonProgressService) {
        this.homeworkSubmissionModel = homeworkSubmissionModel;
        this.lessonProgressService = lessonProgressService;
    }
    async create(createHomeworkSubmissionDto) {
        return await this.homeworkSubmissionModel.create({ ...createHomeworkSubmissionDto });
    }
    async findAll() {
        return await this.homeworkSubmissionModel.findAll();
    }
    async findOne(id) {
        const submission = await this.homeworkSubmissionModel.findOne({ where: { id } });
        if (!submission) {
            throw new NotFoundException(`Homework submission with ID ${id} not found`);
        }
        return submission;
    }
    async findByHomeworkId(homeworkId) {
        return await this.homeworkSubmissionModel.findAll({
            where: { homework_id: homeworkId }
        });
    }
    async findByStudentId(studentId) {
        return await this.homeworkSubmissionModel.findAll({
            where: { student_id: studentId }
        });
    }
    async findByStudentAndHomework(studentId, homeworkId) {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId
            }
        });
        if (!submission) {
            throw new NotFoundException(`Homework submission not found for student ${studentId} and homework ${homeworkId}`);
        }
        return submission;
    }
    async update(id, updateHomeworkSubmissionDto) {
        const submission = await this.findOne(id);
        await submission.update(updateHomeworkSubmissionDto);
        return submission;
    }
    async updateFeedback(id, feedback) {
        const submission = await this.findOne(id);
        await submission.update({ feedback });
        return submission;
    }
    async updateStatus(id, status) {
        const submission = await this.findOne(id);
        await submission.update({ status });
        if (status === 'passed' && submission.student_id && submission.homework_id && submission.section) {
            try {
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, submission.section);
            }
            catch (error) {
                console.warn('Failed to update lesson progress:', error);
            }
        }
        return submission;
    }
    async saveBySection(createHomeworkSubmissionDto) {
        const existingSubmission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: createHomeworkSubmissionDto.student_id,
                homework_id: createHomeworkSubmissionDto.homework_id,
                section: createHomeworkSubmissionDto.section
            }
        });
        let submission;
        if (existingSubmission) {
            await existingSubmission.update(createHomeworkSubmissionDto);
            submission = existingSubmission;
        }
        else {
            submission = await this.homeworkSubmissionModel.create({ ...createHomeworkSubmissionDto });
        }
        if (submission.status === 'passed' && submission.student_id && submission.homework_id && submission.section) {
            try {
                await this.lessonProgressService.updateProgressFromHomeworkSubmission(submission.student_id, submission.homework_id, submission.section);
            }
            catch (error) {
                console.warn('Failed to update lesson progress:', error);
            }
        }
        return submission;
    }
    async findBySection(section) {
        return await this.homeworkSubmissionModel.findAll({
            where: { section },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByStudentAndSection(studentId, section) {
        return await this.homeworkSubmissionModel.findAll({
            where: {
                student_id: studentId,
                section: section
            },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByHomeworkAndSection(homeworkId, section) {
        return await this.homeworkSubmissionModel.findAll({
            where: {
                homework_id: homeworkId,
                section: section
            },
            order: [['createdAt', 'DESC']]
        });
    }
    async findByStudentHomeworkAndSection(studentId, homeworkId, section) {
        const submission = await this.homeworkSubmissionModel.findOne({
            where: {
                student_id: studentId,
                homework_id: homeworkId,
                section: section
            }
        });
        if (!submission) {
            throw new NotFoundException(`Homework submission not found for student ${studentId}, homework ${homeworkId}, and section ${section}`);
        }
        return submission;
    }
    async remove(id) {
        const submission = await this.findOne(id);
        await submission.destroy();
    }
};
HomeworkSubmissionsService = __decorate([
    Injectable(),
    __param(0, InjectModel(HomeworkSubmission)),
    __metadata("design:paramtypes", [Object, LessonProgressService])
], HomeworkSubmissionsService);
export { HomeworkSubmissionsService };
//# sourceMappingURL=homework_submissions.service.js.map