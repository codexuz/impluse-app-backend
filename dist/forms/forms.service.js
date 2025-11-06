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
import { Form } from './entities/form.entity.js';
import { Response } from './entities/response.entity.js';
let FormsService = class FormsService {
    constructor(formModel, responseModel) {
        this.formModel = formModel;
        this.responseModel = responseModel;
    }
    async create(createFormDto) {
        return this.formModel.create({ ...createFormDto });
    }
    async findAll() {
        return this.formModel.findAll();
    }
    async findOne(id) {
        const form = await this.formModel.findByPk(id);
        if (!form) {
            throw new NotFoundException(`Form with ID "${id}" not found`);
        }
        return form;
    }
    async update(id, updateFormDto) {
        const form = await this.findOne(id);
        await form.update(updateFormDto);
        return form;
    }
    async remove(id) {
        const form = await this.findOne(id);
        await form.destroy();
    }
    async createResponse(createResponseDto) {
        await this.findOne(createResponseDto.form_id);
        return this.responseModel.create({ ...createResponseDto });
    }
    async findAllResponses() {
        return this.responseModel.findAll();
    }
    async findResponsesByForm(formId) {
        return this.responseModel.findAll({
            where: { form_id: formId }
        });
    }
    async findOneResponse(id) {
        const response = await this.responseModel.findByPk(id);
        if (!response) {
            throw new NotFoundException(`Response with ID "${id}" not found`);
        }
        return response;
    }
    async updateResponse(id, updateResponseDto) {
        const response = await this.findOneResponse(id);
        await response.update(updateResponseDto);
        return response;
    }
    async removeResponse(id) {
        const response = await this.findOneResponse(id);
        await response.destroy();
    }
};
FormsService = __decorate([
    Injectable(),
    __param(0, InjectModel(Form)),
    __param(1, InjectModel(Response)),
    __metadata("design:paramtypes", [Object, Object])
], FormsService);
export { FormsService };
//# sourceMappingURL=forms.service.js.map