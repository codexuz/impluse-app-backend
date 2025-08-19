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
import { Ieltspart3Question } from './entities/ieltspart3-question.entity.js';
let Ieltspart3QuestionService = class Ieltspart3QuestionService {
    constructor(ieltspart3QuestionModel) {
        this.ieltspart3QuestionModel = ieltspart3QuestionModel;
    }
    async create(createIeltspart3QuestionDto) {
        return await this.ieltspart3QuestionModel.create({ ...createIeltspart3QuestionDto });
    }
    async findAll() {
        return await this.ieltspart3QuestionModel.findAll();
    }
    async findOne(id) {
        const question = await this.ieltspart3QuestionModel.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException(`IELTS Part 3 question with ID ${id} not found`);
        }
        return question;
    }
    async findBySpeakingId(speakingId) {
        return await this.ieltspart3QuestionModel.findAll({
            where: { speaking_id: speakingId }
        });
    }
    async update(id, updateIeltspart3QuestionDto) {
        const question = await this.findOne(id);
        await question.update(updateIeltspart3QuestionDto);
        return question;
    }
    async remove(id) {
        const question = await this.findOne(id);
        await question.destroy();
    }
};
Ieltspart3QuestionService = __decorate([
    Injectable(),
    __param(0, InjectModel(Ieltspart3Question)),
    __metadata("design:paramtypes", [Object])
], Ieltspart3QuestionService);
export { Ieltspart3QuestionService };
//# sourceMappingURL=ieltspart3-question.service.js.map