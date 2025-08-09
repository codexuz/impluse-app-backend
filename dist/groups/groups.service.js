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
import { Group } from './entities/group.entity.js';
let GroupsService = class GroupsService {
    constructor(groupModel) {
        this.groupModel = groupModel;
    }
    async create(createGroupDto) {
        return await this.groupModel.create({ ...createGroupDto });
    }
    async findAll() {
        return await this.groupModel.findAll();
    }
    async findOne(id) {
        const group = await this.groupModel.findOne({ where: { id } });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }
    async findAllStudentsInGroup(id) {
        const group = await this.groupModel.findOne({
            where: { id },
            include: [
                {
                    association: 'students',
                    attributes: { exclude: ['password_hash'] },
                },
            ],
        });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }
    async findTeacherOfGroup(id) {
        const group = await this.groupModel.findOne({
            where: { id },
            include: [
                {
                    association: 'teacher',
                    attributes: { exclude: ['password_hash'] },
                },
            ],
        });
        if (!group) {
            throw new NotFoundException(`Group with ID ${id} not found`);
        }
        return group;
    }
    async findByTeacherId(teacherId) {
        return await this.groupModel.findAll({
            where: { teacher_id: teacherId },
            include: [
                {
                    association: 'teacher',
                    attributes: { exclude: ['password_hash'] },
                }
            ]
        });
    }
    async findByLevelId(levelId) {
        return await this.groupModel.findAll({ where: { level_id: levelId } });
    }
    async update(id, updateGroupDto) {
        const group = await this.findOne(id);
        await group.update(updateGroupDto);
        return group;
    }
    async remove(id) {
        const group = await this.findOne(id);
        await group.destroy();
    }
};
GroupsService = __decorate([
    Injectable(),
    __param(0, InjectModel(Group)),
    __metadata("design:paramtypes", [Object])
], GroupsService);
export { GroupsService };
//# sourceMappingURL=groups.service.js.map