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
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Exam } from './entities/exam.entity.js';
import { GroupStudent } from '../group-students/entities/group-student.entity.js';
let ExamService = class ExamService {
    constructor(examModel, groupStudentModel) {
        this.examModel = examModel;
        this.groupStudentModel = groupStudentModel;
    }
    async create(createExamDto) {
        return this.examModel.create({ ...createExamDto });
    }
    async findAll() {
        return this.examModel.findAll();
    }
    async findOne(id) {
        return this.examModel.findByPk(id);
    }
    async update(id, updateExamDto) {
        return this.examModel.update(updateExamDto, {
            where: { id },
        });
    }
    async remove(id) {
        return this.examModel.destroy({
            where: { id },
        });
    }
    async findByGroup(groupId) {
        return this.examModel.findAll({
            where: { group_id: groupId },
            order: [['scheduled_at', 'DESC']],
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.examModel.findAll({
            where: {
                scheduled_at: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [['scheduled_at', 'ASC']],
        });
    }
    async findByStatus(status) {
        return this.examModel.findAll({
            where: { status },
            order: [['scheduled_at', 'DESC']],
        });
    }
    async findByLevel(level) {
        return this.examModel.findAll({
            where: { level },
            order: [['scheduled_at', 'DESC']],
        });
    }
    async getByUserId(userId) {
        const userGroups = await this.groupStudentModel.findAll({
            where: {
                student_id: userId,
                status: 'active'
            },
            attributes: ['group_id']
        });
        if (!userGroups.length) {
            return [];
        }
        const groupIds = userGroups.map(ug => ug.group_id);
        return this.examModel.findAll({
            where: {
                group_id: groupIds
            },
            order: [['scheduled_at', 'DESC']]
        });
    }
};
ExamService = __decorate([
    Injectable(),
    __param(0, InjectModel(Exam)),
    __param(1, InjectModel(GroupStudent)),
    __metadata("design:paramtypes", [Object, Object])
], ExamService);
export { ExamService };
//# sourceMappingURL=exam.service.js.map