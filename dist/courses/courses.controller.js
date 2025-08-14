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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let CoursesController = class CoursesController {
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async create(createCourseDto) {
        return await this.coursesService.create(createCourseDto);
    }
    async findAll() {
        return await this.coursesService.findAll();
    }
    async getCourseProgress(studentId) {
        return await this.coursesService.getCourseProgress(studentId);
    }
    async findOne(id) {
        return await this.coursesService.findOne(id);
    }
    async update(id, updateCourseDto) {
        return await this.coursesService.update(id, updateCourseDto);
    }
    async remove(id) {
        return await this.coursesService.remove(id);
    }
    async hardRemove(id) {
        return await this.coursesService.hardRemove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAll", null);
__decorate([
    Get('progress/:studentId'),
    Roles('admin', 'teacher', 'student'),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getCourseProgress", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "remove", null);
__decorate([
    Delete(':id/hard'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "hardRemove", null);
CoursesController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('courses'),
    __metadata("design:paramtypes", [CoursesService])
], CoursesController);
export { CoursesController };
//# sourceMappingURL=courses.controller.js.map