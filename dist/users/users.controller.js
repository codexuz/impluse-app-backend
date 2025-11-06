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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdatePasswordDto } from "./dto/update-password.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    createTeacher(createTeacherDto) {
        return this.usersService.createTeacher(createTeacherDto);
    }
    createAdmin(createAdminDto) {
        return this.usersService.createAdmin(createAdminDto);
    }
    getAllTeachers() {
        return this.usersService.getAllTeachers();
    }
    getAllAdmins() {
        return this.usersService.getAllAdmins();
    }
    getAllStudents() {
        return this.usersService.getAllStudents();
    }
    getArchivedStudents() {
        return this.usersService.getArchivedStudents();
    }
    getAllSupportTeachers() {
        return this.usersService.getAllSupportTeachers();
    }
    findAll() {
        return this.usersService.findAll();
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
    deactivate(id) {
        return this.usersService.deactivate(id);
    }
    activate(id) {
        return this.usersService.activate(id);
    }
    archiveStudent(id) {
        return this.usersService.archiveStudent(id);
    }
    restoreStudent(id) {
        return this.usersService.restoreStudent(id);
    }
    async updatePassword(id, updatePasswordDto) {
        return this.usersService.updatePassword(id, updatePasswordDto.currentPassword, updatePasswordDto.newPassword);
    }
};
__decorate([
    Post("teachers"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Create a new teacher" }),
    ApiResponse({ status: 201, description: "Teacher created successfully" }),
    ApiResponse({ status: 400, description: "Bad request" }),
    ApiResponse({ status: 409, description: "User already exists" }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTeacherDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createTeacher", null);
__decorate([
    Post("admins"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Create a new admin user" }),
    ApiResponse({ status: 201, description: "Admin created successfully" }),
    ApiResponse({ status: 400, description: "Bad request" }),
    ApiResponse({ status: 409, description: "User already exists" }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAdminDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createAdmin", null);
__decorate([
    Get("teachers"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Get all teachers" }),
    ApiResponse({ status: 200, description: "List of all teachers" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllTeachers", null);
__decorate([
    Get("admins"),
    Roles(Role.ADMIN),
    ApiOperation({ summary: "Get all admins" }),
    ApiResponse({ status: 200, description: "List of all admin users" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllAdmins", null);
__decorate([
    Get("students"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all students" }),
    ApiResponse({ status: 200, description: "List of all students" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllStudents", null);
__decorate([
    Get("students/archived"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Get all archived students" }),
    ApiResponse({ status: 200, description: "List of all archived students (is_active = false)" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getArchivedStudents", null);
__decorate([
    Get("support-teachers"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    ApiOperation({ summary: "Get all support teachers" }),
    ApiResponse({ status: 200, description: "List of all support teachers" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllSupportTeachers", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    Get(":id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    Patch(":id"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    Delete(":id"),
    Roles(Role.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    Patch(":id/deactivate"),
    Roles(Role.ADMIN),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deactivate", null);
__decorate([
    Patch(":id/activate"),
    Roles(Role.ADMIN),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activate", null);
__decorate([
    Patch("students/:id/archive"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Archive a student" }),
    ApiResponse({ status: 200, description: "Student archived successfully (is_active = false)" }),
    ApiResponse({ status: 404, description: "Student not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "archiveStudent", null);
__decorate([
    Patch("students/:id/restore"),
    Roles(Role.ADMIN, Role.TEACHER),
    ApiOperation({ summary: "Restore an archived student to active status" }),
    ApiResponse({ status: 200, description: "Student restored successfully (is_active = true)" }),
    ApiResponse({ status: 404, description: "Student not found" }),
    __param(0, Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "restoreStudent", null);
__decorate([
    Patch(":id/update-password"),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER),
    ApiOperation({
        summary: "Update user password",
        description: "Updates a user's password by their ID. Admins can update any user's password, while regular users can only update their own."
    }),
    ApiResponse({ status: 200, description: "Password updated successfully" }),
    ApiResponse({ status: 400, description: "Invalid input" }),
    ApiResponse({ status: 401, description: "Current password is incorrect" }),
    ApiResponse({ status: 403, description: "Forbidden - insufficient permissions" }),
    ApiResponse({ status: 404, description: "User not found" }),
    __param(0, Param("id")),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePassword", null);
UsersController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller("users"),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map