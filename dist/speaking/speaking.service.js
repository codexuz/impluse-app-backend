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
import { Speaking } from './entities/speaking.entity.js';
import { RoleScenario } from '../role-scenarios/entities/role-scenario.entity.js';
import { PronunciationExercise } from '../pronunciation-exercise/entities/pronunciation-exercise.entity.js';
import { Ieltspart1Question } from '../ieltspart1-question/entities/ieltspart1-question.entity.js';
import { Ieltspart2Question } from '../ieltspart2-question/entities/ieltspart2-question.entity.js';
import { Ieltspart3Question } from '../ieltspart3-question/entities/ieltspart3-question.entity.js';
let SpeakingService = class SpeakingService {
    constructor(speakingModel, roleScenarioModel, pronunciationModel, ieltspart1Model, ieltspart2Model, ieltspart3Model) {
        this.speakingModel = speakingModel;
        this.roleScenarioModel = roleScenarioModel;
        this.pronunciationModel = pronunciationModel;
        this.ieltspart1Model = ieltspart1Model;
        this.ieltspart2Model = ieltspart2Model;
        this.ieltspart3Model = ieltspart3Model;
    }
    async create(createSpeakingDto) {
        const speaking = await this.speakingModel.create({ ...createSpeakingDto });
        if (createSpeakingDto.roleScenarios) {
            await this.roleScenarioModel.bulkCreate(createSpeakingDto.roleScenarios.map(scenario => ({
                ...scenario,
                speaking_id: speaking.id
            })));
        }
        if (createSpeakingDto.pronunciationExercises) {
            await this.pronunciationModel.bulkCreate(createSpeakingDto.pronunciationExercises.map(exercise => ({
                ...exercise,
                speaking_id: speaking.id
            })));
        }
        if (createSpeakingDto.ieltspart1Questions) {
            await this.ieltspart1Model.bulkCreate(createSpeakingDto.ieltspart1Questions.map(question => ({
                ...question,
                speaking_id: speaking.id
            })));
        }
        if (createSpeakingDto.ieltspart2Questions) {
            await this.ieltspart2Model.bulkCreate(createSpeakingDto.ieltspart2Questions.map(question => ({
                ...question,
                speaking_id: speaking.id
            })));
        }
        if (createSpeakingDto.ieltspart3Questions) {
            await this.ieltspart3Model.bulkCreate(createSpeakingDto.ieltspart3Questions.map(question => ({
                ...question,
                speaking_id: speaking.id
            })));
        }
        return this.findOne(speaking.id);
    }
    async findAll() {
        return this.speakingModel.findAll({
            include: [
                { model: RoleScenario, as: 'role_scenario' },
                { model: PronunciationExercise, as: 'pronunciationExercise' },
                { model: Ieltspart1Question, as: 'part1_questions' },
                { model: Ieltspart2Question, as: 'part2_questions' },
                { model: Ieltspart3Question, as: 'part3_questions' },
            ]
        });
    }
    async findOne(id) {
        const speaking = await this.speakingModel.findByPk(id, {
            include: [
                { model: RoleScenario, as: 'role_scenario' },
                { model: PronunciationExercise, as: 'pronunciationExercise' },
                { model: Ieltspart1Question, as: 'part1_questions' },
                { model: Ieltspart2Question, as: 'part2_questions' },
                { model: Ieltspart3Question, as: 'part3_questions' },
            ]
        });
        if (!speaking) {
            throw new NotFoundException('Speaking not found');
        }
        return speaking;
    }
    async update(id, updateSpeakingDto) {
        const speaking = await this.findOne(id);
        await speaking.update(updateSpeakingDto);
        if (updateSpeakingDto.roleScenarios) {
            await this.roleScenarioModel.destroy({ where: { speaking_id: id } });
            await this.roleScenarioModel.bulkCreate(updateSpeakingDto.roleScenarios.map(scenario => ({
                ...scenario,
                speaking_id: id
            })));
        }
        if (updateSpeakingDto.pronunciationExercises) {
            await this.pronunciationModel.destroy({ where: { speaking_id: id } });
            await this.pronunciationModel.bulkCreate(updateSpeakingDto.pronunciationExercises.map(exercise => ({
                ...exercise,
                speaking_id: id
            })));
        }
        if (updateSpeakingDto.ieltspart1Questions) {
            await this.ieltspart1Model.destroy({ where: { speaking_id: id } });
            await this.ieltspart1Model.bulkCreate(updateSpeakingDto.ieltspart1Questions.map(question => ({
                ...question,
                speaking_id: id
            })));
        }
        if (updateSpeakingDto.ieltspart2Questions) {
            await this.ieltspart2Model.destroy({ where: { speaking_id: id } });
            await this.ieltspart2Model.bulkCreate(updateSpeakingDto.ieltspart2Questions.map(question => ({
                ...question,
                speaking_id: id
            })));
        }
        if (updateSpeakingDto.ieltspart3Questions) {
            await this.ieltspart3Model.destroy({ where: { speaking_id: id } });
            await this.ieltspart3Model.bulkCreate(updateSpeakingDto.ieltspart3Questions.map(question => ({
                ...question,
                speaking_id: id
            })));
        }
        return this.findOne(id);
    }
    async remove(id) {
        const speaking = await this.findOne(id);
        await speaking.destroy();
    }
};
SpeakingService = __decorate([
    Injectable(),
    __param(0, InjectModel(Speaking)),
    __param(1, InjectModel(RoleScenario)),
    __param(2, InjectModel(PronunciationExercise)),
    __param(3, InjectModel(Ieltspart1Question)),
    __param(4, InjectModel(Ieltspart2Question)),
    __param(5, InjectModel(Ieltspart3Question)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], SpeakingService);
export { SpeakingService };
//# sourceMappingURL=speaking.service.js.map