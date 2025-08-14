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
import { LeadTrialLesson } from './entities/lead-trial-lesson.entity.js';
import { User } from '../users/entities/user.entity.js';
import { Lead } from '../leads/entities/lead.entity.js';
import { Op } from 'sequelize';
let LeadTrialLessonsService = class LeadTrialLessonsService {
    constructor(trialLessonModel) {
        this.trialLessonModel = trialLessonModel;
    }
    getIncludeOptions() {
        return [
            {
                model: User,
                as: 'teacher',
                attributes: ['id', 'first_name', 'last_name', 'username', 'phone'],
                required: false
            },
            {
                model: Lead,
                as: 'lead',
                attributes: ['id', 'first_name', 'last_name', 'phone', 'status'],
                required: false
            }
        ];
    }
    async create(createLeadTrialLessonDto) {
        try {
            return await this.trialLessonModel.create({ ...createLeadTrialLessonDto });
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(page = 1, limit = 10, search, status, teacherId) {
        const offset = (page - 1) * limit;
        const whereClause = {};
        const includeOptions = this.getIncludeOptions();
        if (search) {
            whereClause[Op.or] = [
                { notes: { [Op.iLike]: `%${search}%` } },
                { '$teacher.first_name$': { [Op.iLike]: `%${search}%` } },
                { '$teacher.last_name$': { [Op.iLike]: `%${search}%` } },
                { '$teacher.username$': { [Op.iLike]: `%${search}%` } },
                { '$lead.first_name$': { [Op.iLike]: `%${search}%` } },
                { '$lead.last_name$': { [Op.iLike]: `%${search}%` } },
                { '$lead.phone$': { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (status) {
            whereClause.status = status;
        }
        if (teacherId) {
            whereClause.teacher_id = teacherId;
        }
        const { count, rows } = await this.trialLessonModel.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['scheduledAt', 'DESC']],
            include: includeOptions,
            distinct: true
        });
        return {
            trialLessons: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        };
    }
    async findOne(id) {
        const trialLesson = await this.trialLessonModel.findByPk(id, {
            include: this.getIncludeOptions()
        });
        if (!trialLesson) {
            throw new NotFoundException(`Trial lesson with ID ${id} not found`);
        }
        return trialLesson;
    }
    async findByStatus(status) {
        return await this.trialLessonModel.findAll({
            where: { status },
            order: [['scheduledAt', 'DESC']],
            include: this.getIncludeOptions()
        });
    }
    async findByTeacher(teacherId) {
        return await this.trialLessonModel.findAll({
            where: { teacher_id: teacherId },
            order: [['scheduledAt', 'DESC']],
            include: this.getIncludeOptions()
        });
    }
    async findByLead(leadId) {
        return await this.trialLessonModel.findAll({
            where: { lead_id: leadId },
            order: [['scheduledAt', 'DESC']],
            include: this.getIncludeOptions()
        });
    }
    async findUpcoming(limit = 20) {
        return await this.trialLessonModel.findAll({
            where: {
                scheduledAt: {
                    [Op.gte]: new Date()
                },
                status: 'belgilangan'
            },
            limit,
            order: [['scheduledAt', 'ASC']],
            include: this.getIncludeOptions()
        });
    }
    async update(id, updateLeadTrialLessonDto) {
        const trialLesson = await this.findOne(id);
        return await trialLesson.update(updateLeadTrialLessonDto);
    }
    async remove(id) {
        const trialLesson = await this.findOne(id);
        await trialLesson.destroy();
    }
    async getTrialLessonStats() {
        const totalTrialLessons = await this.trialLessonModel.count();
        const statusStats = await this.trialLessonModel.findAll({
            attributes: [
                'status',
                [this.trialLessonModel.sequelize.fn('COUNT', this.trialLessonModel.sequelize.col('status')), 'count']
            ],
            group: ['status'],
            raw: true
        });
        const teacherStats = await this.trialLessonModel.findAll({
            attributes: [
                'teacher_id',
                [this.trialLessonModel.sequelize.fn('COUNT', this.trialLessonModel.sequelize.col('teacher_id')), 'count']
            ],
            include: [
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['first_name', 'last_name', 'username']
                }
            ],
            group: ['teacher_id', 'teacher.id', 'teacher.first_name', 'teacher.last_name', 'teacher.username'],
            raw: false
        });
        const upcomingTrialLessons = await this.trialLessonModel.count({
            where: {
                scheduledAt: {
                    [Op.gte]: new Date()
                },
                status: 'belgilangan'
            }
        });
        const trialLessonsByStatus = statusStats.reduce((acc, stat) => {
            acc[stat.status] = parseInt(stat.count);
            return acc;
        }, {});
        const trialLessonsByTeacher = teacherStats.reduce((acc, stat) => {
            const teacherName = stat.teacher ?
                `${stat.teacher.first_name} ${stat.teacher.last_name} (${stat.teacher.username})` :
                'Unknown Teacher';
            acc[stat.teacher_id] = {
                count: parseInt(stat.get('count')),
                teacherName: teacherName
            };
            return acc;
        }, {});
        return {
            totalTrialLessons,
            trialLessonsByStatus,
            trialLessonsByTeacher,
            upcomingTrialLessons
        };
    }
};
LeadTrialLessonsService = __decorate([
    Injectable(),
    __param(0, InjectModel(LeadTrialLesson)),
    __metadata("design:paramtypes", [Object])
], LeadTrialLessonsService);
export { LeadTrialLessonsService };
//# sourceMappingURL=lead-trial-lessons.service.js.map