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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserCourseService } from './user-course.service.js';
import { CreateUserCourseDto } from './dto/create-user-course.dto.js';
import { UpdateUserCourseDto } from './dto/update-user-course.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
let UserCourseController = class UserCourseController {
    constructor(userCourseService) {
        this.userCourseService = userCourseService;
    }
    create(createUserCourseDto) {
        return this.userCourseService.create(createUserCourseDto);
    }
    findAll(userId, courseId) {
        if (userId) {
            return this.userCourseService.findAllByUserId(userId);
        }
        if (courseId) {
            return this.userCourseService.findAllByCourseId(courseId);
        }
        return this.userCourseService.findAll();
    }
    findOne(id) {
        return this.userCourseService.findOne(id);
    }
    findByUserAndCourse(userId, courseId) {
        return this.userCourseService.findByUserAndCourse(userId, courseId);
    }
    update(id, updateUserCourseDto) {
        return this.userCourseService.update(id, updateUserCourseDto);
    }
    remove(id) {
        return this.userCourseService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Assign a user to a course' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserCourseDto]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all user-course assignments, can filter by userId or courseId' }),
    __param(0, Query('userId')),
    __param(1, Query('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get user-course assignment by id' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "findOne", null);
__decorate([
    Get('user/:userId/course/:courseId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get user-course assignment by user and course ids' }),
    __param(0, Param('userId')),
    __param(1, Param('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "findByUserAndCourse", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update user-course assignment' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserCourseDto]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete user-course assignment' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserCourseController.prototype, "remove", null);
UserCourseController = __decorate([
    ApiTags('User Courses'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('user-courses'),
    __metadata("design:paramtypes", [UserCourseService])
], UserCourseController);
export { UserCourseController };
//# sourceMappingURL=user-course.controller.js.map