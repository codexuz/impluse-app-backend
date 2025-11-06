var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException, ConflictException, } from "@nestjs/common";
import { LessonSchedule } from "./entities/lesson-schedule.entity.js";
import { Op } from "sequelize";
let LessonSchedulesService = class LessonSchedulesService {
    async create(createLessonScheduleDto) {
        if (createLessonScheduleDto.group_id &&
            createLessonScheduleDto.start_time &&
            createLessonScheduleDto.end_time) {
            const existingSchedule = await LessonSchedule.findOne({
                where: {
                    group_id: createLessonScheduleDto.group_id,
                    [Op.or]: [
                        {
                            start_time: {
                                [Op.lte]: createLessonScheduleDto.start_time,
                            },
                            end_time: {
                                [Op.gte]: createLessonScheduleDto.start_time,
                            },
                        },
                        {
                            start_time: {
                                [Op.lte]: createLessonScheduleDto.end_time,
                            },
                            end_time: {
                                [Op.gte]: createLessonScheduleDto.end_time,
                            },
                        },
                        {
                            start_time: {
                                [Op.gte]: createLessonScheduleDto.start_time,
                            },
                            end_time: {
                                [Op.lte]: createLessonScheduleDto.end_time,
                            },
                        },
                    ],
                },
            });
            if (existingSchedule) {
                throw new ConflictException("A lesson schedule already exists for this group with overlapping time");
            }
        }
        return await LessonSchedule.create(createLessonScheduleDto);
    }
    async findAll() {
        return await LessonSchedule.findAll({
            order: [["created_at", "DESC"]],
            include: [
                {
                    association: "group",
                    include: [
                        {
                            association: "teacher",
                            attributes: {
                                exclude: ["password_hash"],
                            },
                        },
                    ],
                },
            ],
        });
    }
    async findOne(id) {
        const lessonSchedule = await LessonSchedule.findByPk(id, {
            include: [
                {
                    association: "group",
                    include: [
                        {
                            association: "teacher",
                            attributes: {
                                exclude: ["password_hash"],
                            },
                        },
                    ],
                },
            ],
        });
        if (!lessonSchedule) {
            throw new NotFoundException(`Lesson schedule with ID ${id} not found`);
        }
        return lessonSchedule;
    }
    async findByGroupId(groupId) {
        return await LessonSchedule.findAll({
            where: { group_id: groupId },
            order: [["created_at", "DESC"]],
            include: [
                {
                    association: "group",
                    include: [
                        {
                            association: "teacher",
                            attributes: {
                                exclude: ["password_hash"],
                            },
                        },
                    ],
                },
            ],
        });
    }
    async update(id, updateLessonScheduleDto) {
        const lessonSchedule = await this.findOne(id);
        if (updateLessonScheduleDto.start_time ||
            updateLessonScheduleDto.end_time ||
            updateLessonScheduleDto.group_id) {
            const groupId = updateLessonScheduleDto.group_id || lessonSchedule.group_id;
            const startTime = updateLessonScheduleDto.start_time || lessonSchedule.start_time;
            const endTime = updateLessonScheduleDto.end_time || lessonSchedule.end_time;
            const existingSchedule = await LessonSchedule.findOne({
                where: {
                    id: { [Op.ne]: id },
                    group_id: groupId,
                    [Op.or]: [
                        {
                            start_time: {
                                [Op.lte]: startTime,
                            },
                            end_time: {
                                [Op.gte]: startTime,
                            },
                        },
                        {
                            start_time: {
                                [Op.lte]: endTime,
                            },
                            end_time: {
                                [Op.gte]: endTime,
                            },
                        },
                        {
                            start_time: {
                                [Op.gte]: startTime,
                            },
                            end_time: {
                                [Op.lte]: endTime,
                            },
                        },
                    ],
                },
            });
            if (existingSchedule) {
                throw new ConflictException("A lesson schedule already exists for this group with overlapping time");
            }
        }
        await lessonSchedule.update(updateLessonScheduleDto);
        return lessonSchedule;
    }
    async remove(id) {
        const lessonSchedule = await this.findOne(id);
        await lessonSchedule.destroy();
        return { id, deleted: true };
    }
    async findActiveSchedules() {
        const currentDate = new Date();
        return await LessonSchedule.findAll({
            where: {
                end_time: {
                    [Op.gte]: currentDate,
                },
            },
            order: [["start_time", "ASC"]],
            include: [
                {
                    association: "group",
                    include: [
                        {
                            association: "teacher",
                            attributes: {
                                exclude: ["password_hash"],
                            },
                        },
                    ],
                },
            ],
        });
    }
};
LessonSchedulesService = __decorate([
    Injectable()
], LessonSchedulesService);
export { LessonSchedulesService };
//# sourceMappingURL=lesson-schedules.service.js.map