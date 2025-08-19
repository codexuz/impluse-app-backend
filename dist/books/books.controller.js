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
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let BooksController = class BooksController {
    constructor(booksService) {
        this.booksService = booksService;
    }
    create(createBookDto) {
        return this.booksService.create(createBookDto);
    }
    findAll() {
        return this.booksService.findAll();
    }
    findByLevel(level) {
        return this.booksService.findByLevel(level);
    }
    findOne(id) {
        return this.booksService.findOne(id);
    }
    update(id, updateBookDto) {
        return this.booksService.update(id, updateBookDto);
    }
    remove(id) {
        return this.booksService.remove(id);
    }
    incrementViewCount(id) {
        return this.booksService.incrementViewCount(id);
    }
};
__decorate([
    Post(),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "create", null);
__decorate([
    Get(),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findAll", null);
__decorate([
    Get('level/:level'),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findByLevel", null);
__decorate([
    Get(':id'),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateBookDto]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "remove", null);
__decorate([
    Patch(':id/view'),
    UseGuards(RolesGuard),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BooksController.prototype, "incrementViewCount", null);
BooksController = __decorate([
    Controller('books'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BooksService])
], BooksController);
export { BooksController };
//# sourceMappingURL=books.controller.js.map