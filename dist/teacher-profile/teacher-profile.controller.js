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
import { TeacherProfileService } from './teacher-profile.service.js';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto.js';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
let TeacherProfileController = class TeacherProfileController {
    constructor(teacherProfileService) {
        this.teacherProfileService = teacherProfileService;
    }
    create(createTeacherProfileDto) {
        return this.teacherProfileService.create(createTeacherProfileDto);
    }
    findAll() {
        return this.teacherProfileService.findAll();
    }
    findByUserId(userId) {
        return this.teacherProfileService.findByUserId(userId);
    }
    findOne(id) {
        return this.teacherProfileService.findOne(id);
    }
    update(id, updateTeacherProfileDto) {
        return this.teacherProfileService.update(id, updateTeacherProfileDto);
    }
    remove(id) {
        return this.teacherProfileService.remove(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new teacher profile' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTeacherProfileDto]),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all teacher profiles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "findAll", null);
__decorate([
    Get('user/:userId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get teacher profile by user ID' }),
    ApiParam({ name: 'userId', description: 'User ID (UUID)', type: 'string' }),
    __param(0, Param('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "findByUserId", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get teacher profile by ID' }),
    ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update teacher profile' }),
    ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTeacherProfileDto]),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete teacher profile' }),
    ApiParam({ name: 'id', description: 'Profile ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeacherProfileController.prototype, "remove", null);
TeacherProfileController = __decorate([
    ApiTags('Teacher Profile'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('teacher-profile'),
    __metadata("design:paramtypes", [TeacherProfileService])
], TeacherProfileController);
export { TeacherProfileController };
//# sourceMappingURL=teacher-profile.controller.js.map