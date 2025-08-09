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
import { UserCourse } from './entities/user-course.entity.js';
let UserCourseService = class UserCourseService {
    constructor(userCourseModel) {
        this.userCourseModel = userCourseModel;
    }
    async create(createUserCourseDto) {
        return this.userCourseModel.create({
            ...createUserCourseDto,
        });
    }
    async findAll() {
        return this.userCourseModel.findAll();
    }
    async findAllByUserId(userId) {
        return this.userCourseModel.findAll({
            where: {
                userId,
            },
        });
    }
    async findAllByCourseId(courseId) {
        return this.userCourseModel.findAll({
            where: {
                courseId,
            },
        });
    }
    async findOne(id) {
        const userCourse = await this.userCourseModel.findByPk(id);
        if (!userCourse) {
            throw new NotFoundException(`User course with ID "${id}" not found`);
        }
        return userCourse;
    }
    async update(id, updateUserCourseDto) {
        const userCourse = await this.findOne(id);
        if (updateUserCourseDto.isCompleted && !userCourse.isCompleted) {
            updateUserCourseDto.completedAt = new Date();
        }
        await userCourse.update(updateUserCourseDto);
        return userCourse;
    }
    async remove(id) {
        const userCourse = await this.findOne(id);
        await userCourse.destroy();
    }
    async findByUserAndCourse(userId, courseId) {
        const userCourse = await this.userCourseModel.findOne({
            where: {
                userId,
                courseId,
            },
        });
        if (!userCourse) {
            throw new NotFoundException(`User course not found for user ${userId} and course ${courseId}`);
        }
        return userCourse;
    }
};
UserCourseService = __decorate([
    Injectable(),
    __param(0, InjectModel(UserCourse)),
    __metadata("design:paramtypes", [Object])
], UserCourseService);
export { UserCourseService };
//# sourceMappingURL=user-course.service.js.map