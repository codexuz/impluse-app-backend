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
import { PronunciationExercise } from './entities/pronunciation-exercise.entity.js';
let PronunciationExerciseService = class PronunciationExerciseService {
    constructor(pronunciationExerciseModel) {
        this.pronunciationExerciseModel = pronunciationExerciseModel;
    }
    async create(createPronunciationExerciseDto) {
        return await this.pronunciationExerciseModel.create({
            ...createPronunciationExerciseDto
        });
    }
    async findAll() {
        return await this.pronunciationExerciseModel.findAll();
    }
    async findOne(id) {
        const exercise = await this.pronunciationExerciseModel.findByPk(id);
        if (!exercise) {
            throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
        }
        return exercise;
    }
    async findBySpeakingId(speaking_id) {
        return await this.pronunciationExerciseModel.findAll({
            where: { speaking_id }
        });
    }
    async update(id, updatePronunciationExerciseDto) {
        const [affectedCount, [updatedExercise]] = await this.pronunciationExerciseModel.update(updatePronunciationExerciseDto, {
            where: { id },
            returning: true
        });
        if (affectedCount === 0) {
            throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
        }
        return updatedExercise;
    }
    async remove(id) {
        const deleted = await this.pronunciationExerciseModel.destroy({
            where: { id }
        });
        if (deleted === 0) {
            throw new NotFoundException(`Pronunciation exercise with ID ${id} not found`);
        }
    }
};
PronunciationExerciseService = __decorate([
    Injectable(),
    __param(0, InjectModel(PronunciationExercise)),
    __metadata("design:paramtypes", [Object])
], PronunciationExerciseService);
export { PronunciationExerciseService };
//# sourceMappingURL=pronunciation-exercise.service.js.map