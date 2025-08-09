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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentBookService } from './student-book.service.js';
import { CreateStudentBookDto } from './dto/create-student-book.dto.js';
import { UpdateStudentBookDto } from './dto/update-student-book.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let StudentBookController = class StudentBookController {
    constructor(studentBookService) {
        this.studentBookService = studentBookService;
    }
    create(createStudentBookDto) {
        return this.studentBookService.create(createStudentBookDto);
    }
    findAll() {
        return this.studentBookService.findAll();
    }
    findOne(id) {
        return this.studentBookService.findOne(id);
    }
    findByStudentId(studentId) {
        return this.studentBookService.findByStudentId(studentId);
    }
    findByStudentAndLevel(studentId, levelId) {
        return this.studentBookService.findByStudentAndLevel(studentId, levelId);
    }
    update(id, updateStudentBookDto) {
        return this.studentBookService.update(id, updateStudentBookDto);
    }
    remove(id) {
        return this.studentBookService.remove(id);
    }
};
__decorate([
    Post(),
    Roles('admin'),
    ApiOperation({ summary: 'Create student book' }),
    ApiResponse({ status: 201, description: 'Successfully created.' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentBookDto]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all student books' }),
    ApiResponse({ status: 200, description: 'Return all student books.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get student book by id' }),
    ApiResponse({ status: 200, description: 'Return student book.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "findOne", null);
__decorate([
    Get('student/:studentId'),
    ApiOperation({ summary: 'Get books by student ID (based on their level)' }),
    ApiResponse({ status: 200, description: 'Return books available to the student.' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "findByStudentId", null);
__decorate([
    Get('student/:studentId/level/:levelId'),
    ApiOperation({ summary: 'Get books by student ID and specific level' }),
    ApiResponse({ status: 200, description: 'Return books for the specified level.' }),
    ApiResponse({ status: 404, description: 'Student not found or not assigned to level.' }),
    __param(0, Param('studentId')),
    __param(1, Param('levelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "findByStudentAndLevel", null);
__decorate([
    Patch(':id'),
    Roles('admin'),
    ApiOperation({ summary: 'Update student book' }),
    ApiResponse({ status: 200, description: 'Successfully updated.' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentBookDto]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles('admin'),
    ApiOperation({ summary: 'Delete student book' }),
    ApiResponse({ status: 200, description: 'Successfully deleted.' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentBookController.prototype, "remove", null);
StudentBookController = __decorate([
    ApiTags('student-books'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('student-books'),
    __metadata("design:paramtypes", [StudentBookService])
], StudentBookController);
export { StudentBookController };
//# sourceMappingURL=student-book.controller.js.map