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
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { GroupAssignedUnit } from "./entities/group_assigned_unit.entity.js";
import { LessonService } from "../lesson/lesson.service.js";
import { GroupAssignedLessonsService } from "../group_assigned_lessons/group_assigned_lessons.service.js";
let GroupAssignedUnitsService = class GroupAssignedUnitsService {
    constructor(groupAssignedUnitModel, lessonService, groupAssignedLessonsService) {
        this.groupAssignedUnitModel = groupAssignedUnitModel;
        this.lessonService = lessonService;
        this.groupAssignedLessonsService = groupAssignedLessonsService;
    }
    async create(createDto) {
        const assignedUnit = await this.groupAssignedUnitModel.create({
            ...createDto,
        });
        try {
            const lessons = await this.lessonService.findByModuleId(createDto.unit_id);
            if (lessons && lessons.length > 0) {
                const startDate = createDto.start_date
                    ? new Date(createDto.start_date)
                    : new Date();
                const endDate = createDto.end_date
                    ? new Date(createDto.end_date)
                    : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                const lessonPromises = lessons.map((lesson, index) => {
                    return this.groupAssignedLessonsService.create({
                        lesson_id: lesson.id,
                        group_id: createDto.group_id,
                        granted_by: createDto.teacher_id,
                        group_assigned_unit_id: assignedUnit.id,
                        start_from: startDate,
                        end_at: endDate,
                        status: createDto.status,
                    });
                });
                await Promise.all(lessonPromises);
            }
        }
        catch (error) {
            console.error("Failed to assign lessons to group:", error);
        }
        return assignedUnit;
    }
    async findAll() {
        return await this.groupAssignedUnitModel.findAll({
            include: ["unit"],
        });
    }
    async findOne(id) {
        const assigned = await this.groupAssignedUnitModel.findByPk(id, {
            include: ["unit"],
        });
        if (!assigned) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }
        return assigned;
    }
    async findByGroupId(groupId) {
        return await this.groupAssignedUnitModel.findAll({
            where: { group_id: groupId },
            include: [
                {
                    association: "unit",
                    order: [["order", "ASC"]],
                },
                {
                    association: "lessons",
                    include: [
                        {
                            association: "lesson",
                            order: [["order", "ASC"]],
                        },
                    ],
                },
            ],
            order: [["createdAt", "ASC"]],
        });
    }
    async update(id, updateDto) {
        const unit = await this.findOne(id);
        const [affectedCount] = await this.groupAssignedUnitModel.update(updateDto, {
            where: { id },
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }
        if (updateDto.start_date || updateDto.end_date) {
            try {
                const assignedLessons = await this.groupAssignedLessonsService.findByUnitId(id);
                if (assignedLessons && assignedLessons.length > 0) {
                    const startDate = updateDto.start_date
                        ? new Date(updateDto.start_date)
                        : null;
                    const endDate = updateDto.end_date
                        ? new Date(updateDto.end_date)
                        : null;
                    const updatePromises = assignedLessons.map((lesson) => this.groupAssignedLessonsService.update(lesson.id, {
                        ...(startDate && { start_from: startDate }),
                        ...(endDate && { end_at: endDate }),
                        ...(updateDto.status && { status: updateDto.status }),
                    }));
                    await Promise.all(updatePromises);
                }
            }
            catch (error) {
                console.error(`Failed to update lesson assignments for unit ${id}:`, error);
            }
        }
        return await this.findOne(id);
    }
    async remove(id) {
        const assignedUnit = await this.groupAssignedUnitModel.findByPk(id);
        if (!assignedUnit) {
            throw new NotFoundException(`Group assigned unit with ID ${id} not found`);
        }
        try {
            const assignedLessons = await this.groupAssignedLessonsService.findByUnitId(id);
            if (assignedLessons && assignedLessons.length > 0) {
                const deletePromises = assignedLessons.map((lesson) => this.groupAssignedLessonsService.remove(lesson.id));
                await Promise.all(deletePromises);
            }
        }
        catch (error) {
            console.error(`Failed to remove lesson assignments for unit ${id}:`, error);
        }
        await assignedUnit.destroy();
    }
};
GroupAssignedUnitsService = __decorate([
    Injectable(),
    __param(0, InjectModel(GroupAssignedUnit)),
    __metadata("design:paramtypes", [Object, LessonService,
        GroupAssignedLessonsService])
], GroupAssignedUnitsService);
export { GroupAssignedUnitsService };
//# sourceMappingURL=group_assigned_units.service.js.map