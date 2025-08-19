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
import { Lesson } from './entities/lesson.entity.js';
import { Exercise } from '../exercise/entities/exercise.entity.js';
import { LessonContent } from '../lesson-content/entities/lesson-content.entity.js';
import { LessonVocabularySet } from '../lesson_vocabulary_sets/entities/lesson_vocabulary_set.entity.js';
import { VocabularySet } from '../vocabulary_sets/entities/vocabulary_set.entity.js';
import { VocabularyItem } from '../vocabulary_items/entities/vocabulary_item.entity.js';
import { GroupAssignedLesson } from '../group_assigned_lessons/entities/group_assigned_lesson.entity.js';
let LessonService = class LessonService {
    constructor(lessonModel, groupAssignedLessonModel) {
        this.lessonModel = lessonModel;
        this.groupAssignedLessonModel = groupAssignedLessonModel;
    }
    async create(createLessonDto) {
        const lesson = await this.lessonModel.create({
            ...createLessonDto,
            isActive: true
        });
        return lesson;
    }
    async findAll() {
        return this.lessonModel.findAll({
            where: {
                isActive: true,
            },
            order: [['createdAt', 'ASC']]
        });
    }
    async findOne(id) {
        const lesson = await this.lessonModel.findOne({
            where: {
                id,
                isActive: true,
            },
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async findMyLessons(student_id) {
        return await this.groupAssignedLessonModel.findAll({
            where: { student_id },
            include: [{
                    model: this.lessonModel,
                    as: 'lesson',
                    where: { isActive: true }
                }]
        });
    }
    async findOneWithContent(id) {
        const lesson = await this.lessonModel.findOne({
            where: {
                id,
                isActive: true,
            },
            include: [
                {
                    model: LessonContent,
                    as: 'lessonContents',
                }
            ]
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async findOneWithVocabulary(id) {
        const lesson = await this.lessonModel.findOne({
            where: {
                id,
                isActive: true,
            },
            include: [
                {
                    model: LessonVocabularySet,
                    as: 'lessonVocabularySets',
                    include: [
                        {
                            model: VocabularySet,
                            as: 'vocabularySet',
                            include: [
                                {
                                    model: VocabularyItem,
                                    as: 'vocabularyItems'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async findOneWithExercises(id) {
        const lesson = await this.lessonModel.findOne({
            where: {
                id,
                isActive: true,
            },
            include: [
                {
                    model: Exercise,
                    as: 'exercises',
                }
            ],
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return lesson;
    }
    async update(id, updateLessonDto) {
        const [affectedCount, [updatedLesson]] = await this.lessonModel.update(updateLessonDto, {
            where: { id, isActive: true },
            returning: true
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return updatedLesson;
    }
    async remove(id) {
        const affected = await this.lessonModel.update({ isActive: false }, { where: { id, isActive: true } });
        if (affected[0] === 0) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
    }
    async findByUnit(unitId, throwIfEmpty = false) {
        if (!unitId) {
            throw new Error('Unit ID is required');
        }
        try {
            const lessons = await this.lessonModel.findAll({
                where: {
                    moduleId: unitId,
                    isActive: true
                },
                order: [['order', 'ASC']],
                include: [
                    {
                        model: LessonContent,
                        as: 'lessonContents',
                    }
                ]
            });
            if (!lessons.length && throwIfEmpty) {
                throw new NotFoundException(`No lessons found for unit ID ${unitId}`);
            }
            return lessons;
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to fetch lessons for unit ${unitId}: ${error.message}`);
        }
    }
    async findByModuleId(moduleId, includeContent = false) {
        if (!moduleId) {
            throw new Error('Module ID is required');
        }
        const includeOptions = [];
        if (includeContent) {
            includeOptions.push({
                model: LessonContent,
                as: 'lessonContents',
            });
        }
        const lessons = await this.lessonModel.findAll({
            where: {
                moduleId,
                isActive: true
            },
            order: [['order', 'ASC']],
            include: includeOptions
        });
        return lessons;
    }
    async findByModuleIdWithExercises(moduleId) {
        if (!moduleId) {
            throw new Error('Module ID is required');
        }
        const lessons = await this.lessonModel.findAll({
            where: {
                moduleId,
                isActive: true
            },
            order: [['order', 'ASC']],
            include: [
                {
                    model: Exercise,
                    as: 'exercises',
                }
            ]
        });
        return lessons;
    }
    async findByModuleIdWithVocabulary(moduleId) {
        if (!moduleId) {
            throw new Error('Module ID is required');
        }
        const lessons = await this.lessonModel.findAll({
            where: {
                moduleId,
                isActive: true
            },
            order: [['order', 'ASC']],
            include: [
                {
                    model: LessonVocabularySet,
                    as: 'lessonVocabularySets',
                    include: [
                        {
                            model: VocabularySet,
                            as: 'vocabularySet',
                            include: [
                                {
                                    model: VocabularyItem,
                                    as: 'vocabularyItems'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return lessons;
    }
};
LessonService = __decorate([
    Injectable(),
    __param(0, InjectModel(Lesson)),
    __param(1, InjectModel(GroupAssignedLesson)),
    __metadata("design:paramtypes", [Object, Object])
], LessonService);
export { LessonService };
//# sourceMappingURL=lesson.service.js.map