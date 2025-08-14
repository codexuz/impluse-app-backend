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
import { StudentBookUnit } from './entities/student-book-unit.entity.js';
let StudentBookUnitsService = class StudentBookUnitsService {
    constructor(studentBookUnitModel) {
        this.studentBookUnitModel = studentBookUnitModel;
    }
    async create(createStudentBookUnitDto) {
        return await this.studentBookUnitModel.create({
            ...createStudentBookUnitDto,
        });
    }
    async findAll() {
        return await this.studentBookUnitModel.findAll();
    }
    async findOne(id) {
        const unit = await this.studentBookUnitModel.findByPk(id);
        if (!unit) {
            throw new NotFoundException('Student book unit not found');
        }
        return unit;
    }
    async update(id, updateStudentBookUnitDto) {
        const unit = await this.findOne(id);
        return await unit.update(updateStudentBookUnitDto);
    }
    async remove(id) {
        const unit = await this.findOne(id);
        await unit.destroy();
        return { id };
    }
};
StudentBookUnitsService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentBookUnit)),
    __metadata("design:paramtypes", [Object])
], StudentBookUnitsService);
export { StudentBookUnitsService };
//# sourceMappingURL=student-book-units.service.js.map