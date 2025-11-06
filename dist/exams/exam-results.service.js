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
import { ExamResult } from './entities/exam_result.entity.js';
import { Exam } from './entities/exam.entity.js';
import { User } from '../users/entities/user.entity.js';
let ExamResultsService = class ExamResultsService {
    constructor(examResultModel, examModel) {
        this.examResultModel = examResultModel;
        this.examModel = examModel;
    }
    async create(createExamResultDto) {
        const exam = await this.examModel.findByPk(createExamResultDto.exam_id);
        if (!exam) {
            throw new NotFoundException(`Exam with ID ${createExamResultDto.exam_id} not found`);
        }
        if (!createExamResultDto.percentage && createExamResultDto.score !== undefined && createExamResultDto.max_score) {
            createExamResultDto.percentage = (createExamResultDto.score / createExamResultDto.max_score) * 100;
        }
        if (!createExamResultDto.result && createExamResultDto.percentage !== undefined) {
            createExamResultDto.result = createExamResultDto.percentage >= 60 ? 'passed' : 'failed';
        }
        return this.examResultModel.create(createExamResultDto);
    }
    async findAll() {
        return this.examResultModel.findAll({
            include: [
                { model: Exam, as: "exam" },
                { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
            ]
        });
    }
    async findOne(id) {
        const result = await this.examResultModel.findOne({
            where: { id },
            include: [
                { model: Exam, as: "exam" },
                { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
            ]
        });
        if (!result) {
            throw new NotFoundException(`Exam result with ID ${id} not found`);
        }
        return result;
    }
    async findByExam(examId) {
        return this.examResultModel.findAll({
            where: { exam_id: examId },
            include: [
                { model: Exam, as: "exam" },
                { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
            ]
        });
    }
    async findByStudent(studentId) {
        return this.examResultModel.findAll({
            where: { student_id: studentId },
            include: [
                { model: Exam, as: "exam" },
                { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
            ]
        });
    }
    async findByExamAndStudent(examId, studentId) {
        const result = await this.examResultModel.findOne({
            where: {
                exam_id: examId,
                student_id: studentId
            },
            include: [
                { model: Exam, as: "exam" },
                { model: User, as: "student", attributes: ["user_id", "first_name", "last_name"] }
            ]
        });
        if (!result) {
            throw new NotFoundException(`Exam result for exam ${examId} and student ${studentId} not found`);
        }
        return result;
    }
    async update(id, updateExamResultDto) {
        const result = await this.findOne(id);
        if ((updateExamResultDto.score !== undefined || updateExamResultDto.max_score !== undefined) &&
            (result.max_score || updateExamResultDto.max_score)) {
            const score = updateExamResultDto.score ?? result.score;
            const maxScore = updateExamResultDto.max_score ?? result.max_score;
            updateExamResultDto.percentage = (score / maxScore) * 100;
        }
        if (updateExamResultDto.percentage !== undefined) {
            updateExamResultDto.result = updateExamResultDto.percentage >= 60 ? 'passed' : 'failed';
        }
        await result.update(updateExamResultDto);
        return result;
    }
    async remove(id) {
        const result = await this.findOne(id);
        await result.destroy();
    }
    async getExamStatistics(examId) {
        const results = await this.findByExam(examId);
        if (results.length === 0) {
            return {
                totalStudents: 0,
                averageScore: 0,
                passRate: 0,
                sectionAverages: {}
            };
        }
        const totalStudents = results.length;
        const averageScore = results.reduce((sum, result) => sum + result.percentage, 0) / totalStudents;
        const passedCount = results.filter(result => result.result === 'passed').length;
        const passRate = (passedCount / totalStudents) * 100;
        const sectionTotals = {};
        const sectionTypes = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'];
        results.forEach(result => {
            if (result.section_scores) {
                Object.entries(result.section_scores).forEach(([section, score]) => {
                    if (!sectionTotals[section]) {
                        sectionTotals[section] = { sum: 0, count: 0 };
                    }
                    sectionTotals[section].sum += score;
                    sectionTotals[section].count += 1;
                });
            }
        });
        const sectionAverages = {};
        Object.entries(sectionTotals).forEach(([section, { sum, count }]) => {
            sectionAverages[section] = count > 0 ? sum / count : 0;
        });
        return {
            totalStudents,
            averageScore,
            passRate,
            sectionAverages
        };
    }
};
ExamResultsService = __decorate([
    Injectable(),
    __param(0, InjectModel(ExamResult)),
    __param(1, InjectModel(Exam)),
    __metadata("design:paramtypes", [Object, Object])
], ExamResultsService);
export { ExamResultsService };
//# sourceMappingURL=exam-results.service.js.map