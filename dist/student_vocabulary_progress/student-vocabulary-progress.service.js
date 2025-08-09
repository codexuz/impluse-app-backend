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
import { StudentVocabularyProgress } from './entities/student_vocabulary_progress.entity.js';
import { VocabularyProgressStatus } from './enums/vocabulary-progress-status.enum.js';
let StudentVocabularyProgressService = class StudentVocabularyProgressService {
    constructor(studentVocabularyProgressModel) {
        this.studentVocabularyProgressModel = studentVocabularyProgressModel;
    }
    async create(createDto) {
        return this.studentVocabularyProgressModel.create({ ...createDto });
    }
    async findAll() {
        return this.studentVocabularyProgressModel.findAll();
    }
    async findOne(id) {
        const progress = await this.studentVocabularyProgressModel.findByPk(id);
        if (!progress) {
            throw new NotFoundException(`Progress with ID ${id} not found`);
        }
        return progress;
    }
    async findByStudent(studentId) {
        return this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId }
        });
    }
    async findByVocabularyItem(vocabularyItemId) {
        return this.studentVocabularyProgressModel.findAll({
            where: { vocabulary_item_id: vocabularyItemId }
        });
    }
    async findByStudentAndVocabularyItem(studentId, vocabularyItemId) {
        const progress = await this.studentVocabularyProgressModel.findOne({
            where: {
                student_id: studentId,
                vocabulary_item_id: vocabularyItemId
            }
        });
        if (!progress) {
            throw new NotFoundException(`Progress not found for student ${studentId} and vocabulary item ${vocabularyItemId}`);
        }
        return progress;
    }
    async update(id, updateDto) {
        const progress = await this.findOne(id);
        await progress.update(updateDto);
        return progress;
    }
    async remove(id) {
        const progress = await this.findOne(id);
        await progress.destroy();
    }
    async updateStatus(id, status) {
        const progress = await this.findOne(id);
        await progress.update({ status });
        return progress;
    }
    async getStudentProgressStats(studentId) {
        const progress = await this.studentVocabularyProgressModel.findAll({
            where: { student_id: studentId }
        });
        return {
            [VocabularyProgressStatus.LEARNING]: progress.filter(p => p.status === VocabularyProgressStatus.LEARNING).length,
            [VocabularyProgressStatus.REVIEWING]: progress.filter(p => p.status === VocabularyProgressStatus.REVIEWING).length,
            [VocabularyProgressStatus.MASTERED]: progress.filter(p => p.status === VocabularyProgressStatus.MASTERED).length,
        };
    }
};
StudentVocabularyProgressService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentVocabularyProgress)),
    __metadata("design:paramtypes", [Object])
], StudentVocabularyProgressService);
export { StudentVocabularyProgressService };
//# sourceMappingURL=student-vocabulary-progress.service.js.map