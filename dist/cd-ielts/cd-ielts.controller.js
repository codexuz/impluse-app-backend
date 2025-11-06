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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { CdIeltsService } from './cd-ielts.service.js';
import { CreateCdIeltDto } from './dto/create-cd-ielt.dto.js';
import { UpdateCdIeltDto } from './dto/update-cd-ielt.dto.js';
import { CreateCdRegisterDto } from './dto/create-cd-register.dto.js';
import { UpdateCdRegisterDto } from './dto/update-cd-register.dto.js';
let CdIeltsController = class CdIeltsController {
    constructor(cdIeltsService) {
        this.cdIeltsService = cdIeltsService;
    }
    createTest(createCdIeltDto) {
        return this.cdIeltsService.createTest(createCdIeltDto);
    }
    findAllTests() {
        return this.cdIeltsService.findAllTests();
    }
    findActiveTests() {
        return this.cdIeltsService.findActiveTests();
    }
    findOneTest(id) {
        return this.cdIeltsService.findOneTest(id);
    }
    updateTest(id, updateCdIeltDto) {
        return this.cdIeltsService.updateTest(id, updateCdIeltDto);
    }
    removeTest(id) {
        return this.cdIeltsService.removeTest(id);
    }
    register(createCdRegisterDto) {
        return this.cdIeltsService.registerForTest(createCdRegisterDto);
    }
    findAllRegistrations() {
        return this.cdIeltsService.findAllRegistrations();
    }
    findRegistrationsByTest(testId) {
        return this.cdIeltsService.findRegistrationsByTest(testId);
    }
    findRegistrationsByStudent(studentId) {
        return this.cdIeltsService.findRegistrationsByStudent(studentId);
    }
    findOneRegistration(id) {
        return this.cdIeltsService.findOneRegistration(id);
    }
    updateRegistration(id, updateCdRegisterDto) {
        return this.cdIeltsService.updateRegistration(id, updateCdRegisterDto);
    }
    removeRegistration(id) {
        return this.cdIeltsService.removeRegistration(id);
    }
};
__decorate([
    Post('tests'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new IELTS test' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'The test has been successfully created' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCdIeltDto]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "createTest", null);
__decorate([
    Get('tests'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all IELTS tests' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all IELTS tests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findAllTests", null);
__decorate([
    Get('tests/active'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all active IELTS tests' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all active IELTS tests' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findActiveTests", null);
__decorate([
    Get('tests/:id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get an IELTS test by ID' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return the IELTS test' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Test not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findOneTest", null);
__decorate([
    Patch('tests/:id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update an IELTS test' }),
    ApiResponse({ status: HttpStatus.OK, description: 'The test has been successfully updated' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Test not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCdIeltDto]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "updateTest", null);
__decorate([
    Delete('tests/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete an IELTS test' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The test has been successfully deleted' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Test not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "removeTest", null);
__decorate([
    Post('registrations'),
    Roles(Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Register for an IELTS test' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'The registration has been successfully created' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCdRegisterDto]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "register", null);
__decorate([
    Get('registrations'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all IELTS registrations' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all IELTS registrations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findAllRegistrations", null);
__decorate([
    Get('registrations/test/:testId'),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: 'Get all registrations for a specific test' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all registrations for this test' }),
    __param(0, Param('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findRegistrationsByTest", null);
__decorate([
    Get('registrations/student/:studentId'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get all registrations for a specific student' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all registrations for this student' }),
    __param(0, Param('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findRegistrationsByStudent", null);
__decorate([
    Get('registrations/:id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: 'Get a registration by ID' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return the registration' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Registration not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "findOneRegistration", null);
__decorate([
    Patch('registrations/:id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update a registration' }),
    ApiResponse({ status: HttpStatus.OK, description: 'The registration has been successfully updated' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Registration not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCdRegisterDto]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "updateRegistration", null);
__decorate([
    Delete('registrations/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN, Role.STUDENT),
    ApiOperation({ summary: 'Delete a registration' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The registration has been successfully deleted' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Registration not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CdIeltsController.prototype, "removeRegistration", null);
CdIeltsController = __decorate([
    ApiTags('CD IELTS'),
    ApiBearerAuth(),
    Controller('cd-ielts'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __metadata("design:paramtypes", [CdIeltsService])
], CdIeltsController);
export { CdIeltsController };
//# sourceMappingURL=cd-ielts.controller.js.map