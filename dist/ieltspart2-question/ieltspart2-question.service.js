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
import { Ieltspart2Question } from './entities/ieltspart2-question.entity.js';
let Ieltspart2QuestionService = class Ieltspart2QuestionService {
    constructor(ieltspart2QuestionModel) {
        this.ieltspart2QuestionModel = ieltspart2QuestionModel;
    }
    async create(createIeltspart2QuestionDto) {
        return await this.ieltspart2QuestionModel.create({ ...createIeltspart2QuestionDto });
    }
    async findAll() {
        return await this.ieltspart2QuestionModel.findAll();
    }
    async findOne(id) {
        const question = await this.ieltspart2QuestionModel.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException(`IELTS Part 2 question with ID ${id} not found`);
        }
        return question;
    }
    async findBySpeakingId(speakingId) {
        return await this.ieltspart2QuestionModel.findAll({
            where: { speaking_id: speakingId }
        });
    }
    async update(id, updateIeltspart2QuestionDto) {
        const question = await this.findOne(id);
        await question.update(updateIeltspart2QuestionDto);
        return question;
    }
    async remove(id) {
        const question = await this.findOne(id);
        await question.destroy();
    }
};
Ieltspart2QuestionService = __decorate([
    Injectable(),
    __param(0, InjectModel(Ieltspart2Question)),
    __metadata("design:paramtypes", [Object])
], Ieltspart2QuestionService);
export { Ieltspart2QuestionService };
//# sourceMappingURL=ieltspart2-question.service.js.map