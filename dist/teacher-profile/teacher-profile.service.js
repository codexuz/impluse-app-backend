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
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeacherProfile } from './entities/teacher-profile.entity.js';
let TeacherProfileService = class TeacherProfileService {
    constructor(teacherProfileModel) {
        this.teacherProfileModel = teacherProfileModel;
    }
    async create(createTeacherProfileDto) {
        const existingProfile = await this.teacherProfileModel.findOne({
            where: { user_id: createTeacherProfileDto.user_id },
        });
        if (existingProfile) {
            throw new ConflictException('Profile already exists for this teacher');
        }
        return await this.teacherProfileModel.create(createTeacherProfileDto);
    }
    async findAll() {
        return await this.teacherProfileModel.findAll({
            order: [['createdAt', 'DESC']],
        });
    }
    async findByUserId(userId) {
        const profile = await this.teacherProfileModel.findOne({
            where: { user_id: userId },
        });
        if (!profile) {
            throw new NotFoundException(`Profile for user with ID "${userId}" not found`);
        }
        return profile;
    }
    async findOne(id) {
        const profile = await this.teacherProfileModel.findByPk(id);
        if (!profile) {
            throw new NotFoundException(`Teacher profile with ID "${id}" not found`);
        }
        return profile;
    }
    async update(id, updateTeacherProfileDto) {
        const profile = await this.findOne(id);
        await profile.update(updateTeacherProfileDto);
        return profile;
    }
    async remove(id) {
        const profile = await this.findOne(id);
        await profile.destroy();
    }
};
TeacherProfileService = __decorate([
    Injectable(),
    __param(0, InjectModel(TeacherProfile)),
    __metadata("design:paramtypes", [Object])
], TeacherProfileService);
export { TeacherProfileService };
//# sourceMappingURL=teacher-profile.service.js.map