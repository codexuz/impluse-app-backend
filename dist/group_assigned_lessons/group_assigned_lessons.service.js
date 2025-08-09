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
import { GroupAssignedLesson } from './entities/group_assigned_lesson.entity.js';
let GroupAssignedLessonsService = class GroupAssignedLessonsService {
    constructor(groupAssignedLessonModel) {
        this.groupAssignedLessonModel = groupAssignedLessonModel;
    }
    async create(createGroupAssignedLessonDto) {
        return await this.groupAssignedLessonModel.create({
            ...createGroupAssignedLessonDto
        });
    }
    async findAll() {
        return await this.groupAssignedLessonModel.findAll();
    }
    async findOne(id) {
        const assignedLesson = await this.groupAssignedLessonModel.findOne({
            where: { id }
        });
        if (!assignedLesson) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }
        return assignedLesson;
    }
    async findByGroupId(groupId) {
        return await this.groupAssignedLessonModel.findAll({
            where: { group_id: groupId }
        });
    }
    async findByUnitId(unitId) {
        return await this.groupAssignedLessonModel.findAll({
            where: { group_assigned_unit_id: unitId }
        });
    }
    async update(id, updateGroupAssignedLessonDto) {
        const [affectedCount] = await this.groupAssignedLessonModel.update(updateGroupAssignedLessonDto, {
            where: { id }
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const result = await this.groupAssignedLessonModel.destroy({
            where: { id }
        });
        if (result === 0) {
            throw new NotFoundException(`Assigned lesson with ID ${id} not found`);
        }
    }
};
GroupAssignedLessonsService = __decorate([
    Injectable(),
    __param(0, InjectModel(GroupAssignedLesson)),
    __metadata("design:paramtypes", [Object])
], GroupAssignedLessonsService);
export { GroupAssignedLessonsService };
//# sourceMappingURL=group_assigned_lessons.service.js.map