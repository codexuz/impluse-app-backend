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
import { Speaking } from "./entities/speaking.entity.js";
import { PronunciationExercise } from "../pronunciation-exercise/entities/pronunciation-exercise.entity.js";
import { Ieltspart1Question } from "../ieltspart1-question/entities/ieltspart1-question.entity.js";
import { Ieltspart2Question } from "../ieltspart2-question/entities/ieltspart2-question.entity.js";
import { Ieltspart3Question } from "../ieltspart3-question/entities/ieltspart3-question.entity.js";
let SpeakingService = class SpeakingService {
    constructor(speakingModel, pronunciationModel, ieltspart1Model, ieltspart2Model, ieltspart3Model) {
        this.speakingModel = speakingModel;
        this.pronunciationModel = pronunciationModel;
        this.ieltspart1Model = ieltspart1Model;
        this.ieltspart2Model = ieltspart2Model;
        this.ieltspart3Model = ieltspart3Model;
    }
    async create(createSpeakingDto) {
        const speaking = await this.speakingModel.create({
            lessonId: createSpeakingDto.lessonId,
            title: createSpeakingDto.title,
            type: createSpeakingDto.type,
        });
        return speaking;
    }
    async findAll() {
        return this.speakingModel.findAll();
    }
    async findOne(id) {
        const speaking = await this.speakingModel.findByPk(id, {
            include: [
                {
                    model: this.pronunciationModel,
                    as: "pronunciationExercise",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart1Model,
                    as: "part1_questions",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart2Model,
                    as: "part2_questions",
                    required: false,
                },
                {
                    model: this.ieltspart3Model,
                    as: "part3_questions",
                    required: false,
                },
            ],
        });
        if (!speaking) {
            throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
        }
        return speaking;
    }
    async findByLesson(lessonId) {
        const speakingExercises = await this.speakingModel.findAll({
            where: { lessonId },
            include: [
                {
                    model: this.pronunciationModel,
                    as: "pronunciationExercise",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart1Model,
                    as: "part1_questions",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart2Model,
                    as: "part2_questions",
                    required: false,
                },
                {
                    model: this.ieltspart3Model,
                    as: "part3_questions",
                    required: false,
                },
            ],
        });
        return speakingExercises;
    }
    async getByType(type) {
        const speakingExercises = await this.speakingModel.findAll({
            where: { type },
            include: [
                {
                    model: this.pronunciationModel,
                    as: "pronunciationExercise",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart1Model,
                    as: "part1_questions",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart2Model,
                    as: "part2_questions",
                    required: false,
                },
                {
                    model: this.ieltspart3Model,
                    as: "part3_questions",
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return speakingExercises;
    }
    async findByLessonAndType(lessonId, type) {
        const speakingExercises = await this.speakingModel.findAll({
            where: {
                lessonId,
                type,
            },
            include: [
                {
                    model: this.pronunciationModel,
                    as: "pronunciationExercise",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart1Model,
                    as: "part1_questions",
                    required: false,
                    order: [["createdAt", "ASC"]],
                },
                {
                    model: this.ieltspart2Model,
                    as: "part2_questions",
                    required: false,
                },
                {
                    model: this.ieltspart3Model,
                    as: "part3_questions",
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return speakingExercises;
    }
    async update(id, updateSpeakingDto) {
        const speaking = await this.speakingModel.findByPk(id);
        if (!speaking) {
            throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
        }
        await speaking.update(updateSpeakingDto);
        return speaking;
    }
    async countRelatedEntities(id) {
        const pronunciationCount = await this.pronunciationModel.count({
            where: { speaking_id: id },
        });
        const part1Count = await this.ieltspart1Model.count({
            where: { speaking_id: id },
        });
        const part2Count = await this.ieltspart2Model.count({
            where: { speaking_id: id },
        });
        const part3Count = await this.ieltspart3Model.count({
            where: { speaking_id: id },
        });
        return {
            pronunciationExercises: pronunciationCount,
            part1Questions: part1Count,
            part2Questions: part2Count,
            part3Questions: part3Count,
            total: pronunciationCount + part1Count + part2Count + part3Count,
        };
    }
    async deleteRelatedEntities(id) {
        const countBefore = await this.countRelatedEntities(id);
        const t = await this.speakingModel.sequelize.transaction();
        try {
            await this.pronunciationModel.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart1Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart2Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart3Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await t.commit();
            return {
                message: "Successfully deleted all related entities",
                deleted: countBefore,
            };
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    async remove(id) {
        const speaking = await this.speakingModel.findByPk(id);
        if (!speaking) {
            throw new NotFoundException(`Speaking exercise with ID ${id} not found`);
        }
        const countBefore = await this.countRelatedEntities(id);
        const speakingDetails = speaking.toJSON();
        const t = await this.speakingModel.sequelize.transaction();
        try {
            await this.pronunciationModel.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart1Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart2Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await this.ieltspart3Model.destroy({
                where: { speaking_id: id },
                transaction: t,
            });
            await speaking.destroy({ transaction: t });
            await t.commit();
            return {
                message: "Successfully deleted speaking exercise and all related entities",
                speaking: speakingDetails,
                relatedEntities: countBefore,
            };
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
};
SpeakingService = __decorate([
    Injectable(),
    __param(0, InjectModel(Speaking)),
    __param(1, InjectModel(PronunciationExercise)),
    __param(2, InjectModel(Ieltspart1Question)),
    __param(3, InjectModel(Ieltspart2Question)),
    __param(4, InjectModel(Ieltspart3Question)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], SpeakingService);
export { SpeakingService };
//# sourceMappingURL=speaking.service.js.map