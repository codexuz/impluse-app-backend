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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupportSchedule } from './entities/support-schedule.entity.js';
let SupportSchedulesService = class SupportSchedulesService {
    constructor(supportScheduleModel) {
        this.supportScheduleModel = supportScheduleModel;
    }
    async create(createSupportScheduleDto) {
        try {
            const supportSchedule = await this.supportScheduleModel.create({ ...createSupportScheduleDto });
            return supportSchedule;
        }
        catch (error) {
            throw new BadRequestException('Failed to create support schedule', error.message);
        }
    }
    async findAll() {
        return this.supportScheduleModel.findAll({
            order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
        });
    }
    async findOne(id) {
        const supportSchedule = await this.supportScheduleModel.findByPk(id);
        if (!supportSchedule) {
            throw new NotFoundException(`Support schedule with ID ${id} not found`);
        }
        return supportSchedule;
    }
    async findByTeacher(teacherId) {
        return this.supportScheduleModel.findAll({
            where: { support_teacher_id: teacherId },
            order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
        });
    }
    async findByGroup(groupId) {
        return this.supportScheduleModel.findAll({
            where: { group_id: groupId },
            order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
        });
    }
    async findByDateRange(startDate, endDate) {
        return this.supportScheduleModel.findAll({
            where: {
                schedule_date: {
                    $between: [startDate, endDate],
                },
            },
            order: [['schedule_date', 'ASC'], ['start_time', 'ASC']],
        });
    }
    async update(id, updateSupportScheduleDto) {
        const supportSchedule = await this.findOne(id);
        try {
            await supportSchedule.update(updateSupportScheduleDto);
            return supportSchedule;
        }
        catch (error) {
            throw new BadRequestException('Failed to update support schedule', error.message);
        }
    }
    async remove(id) {
        const supportSchedule = await this.findOne(id);
        await supportSchedule.destroy();
    }
    async getScheduleStats() {
        const now = new Date();
        const total = await this.supportScheduleModel.count();
        const upcoming = await this.supportScheduleModel.count({
            where: {
                schedule_date: {
                    $gte: now,
                },
            },
        });
        return {
            totalSchedules: total,
            upcomingSchedules: upcoming,
            pastSchedules: total - upcoming,
        };
    }
};
SupportSchedulesService = __decorate([
    Injectable(),
    __param(0, InjectModel(SupportSchedule)),
    __metadata("design:paramtypes", [Object])
], SupportSchedulesService);
export { SupportSchedulesService };
//# sourceMappingURL=support-schedules.service.js.map