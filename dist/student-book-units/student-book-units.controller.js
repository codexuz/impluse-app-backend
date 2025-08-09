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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StudentBookUnitsService } from './student-book-units.service.js';
import { CreateStudentBookUnitDto } from './dto/create-student-book-unit.dto.js';
import { UpdateStudentBookUnitDto } from './dto/update-student-book-unit.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let StudentBookUnitsController = class StudentBookUnitsController {
    constructor(studentBookUnitsService) {
        this.studentBookUnitsService = studentBookUnitsService;
    }
    create(createStudentBookUnitDto) {
        return this.studentBookUnitsService.create(createStudentBookUnitDto);
    }
    findAll() {
        return this.studentBookUnitsService.findAll();
    }
    findOne(id) {
        return this.studentBookUnitsService.findOne(id);
    }
    update(id, updateStudentBookUnitDto) {
        return this.studentBookUnitsService.update(id, updateStudentBookUnitDto);
    }
    remove(id) {
        return this.studentBookUnitsService.remove(id);
    }
};
__decorate([
    Post(),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Create a new student book unit' }),
    ApiResponse({ status: 201, description: 'Unit created successfully' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStudentBookUnitDto]),
    __metadata("design:returntype", void 0)
], StudentBookUnitsController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all student book units' }),
    ApiResponse({ status: 200, description: 'Return all units' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentBookUnitsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a student book unit by id' }),
    ApiResponse({ status: 200, description: 'Return the unit' }),
    ApiResponse({ status: 404, description: 'Unit not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentBookUnitsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Update a student book unit' }),
    ApiResponse({ status: 200, description: 'Unit updated successfully' }),
    ApiResponse({ status: 404, description: 'Unit not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStudentBookUnitDto]),
    __metadata("design:returntype", void 0)
], StudentBookUnitsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete a student book unit' }),
    ApiResponse({ status: 200, description: 'Unit deleted successfully' }),
    ApiResponse({ status: 404, description: 'Unit not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentBookUnitsController.prototype, "remove", null);
StudentBookUnitsController = __decorate([
    ApiTags('student-book-units'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Controller('student-book-units'),
    __metadata("design:paramtypes", [StudentBookUnitsService])
], StudentBookUnitsController);
export { StudentBookUnitsController };
//# sourceMappingURL=student-book-units.controller.js.map