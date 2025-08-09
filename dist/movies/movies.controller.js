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
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { CreateMovieDto, MovieGenre, MovieType, MovieLevel } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
let MoviesController = class MoviesController {
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async create(createMovieDto) {
        return await this.moviesService.create(createMovieDto);
    }
    async findAll(genre, type, level) {
        return await this.moviesService.findAll({ genre, type, level });
    }
    async search(searchTerm) {
        return await this.moviesService.search(searchTerm);
    }
    async findOne(id) {
        return await this.moviesService.findOne(id);
    }
    async update(id, updateMovieDto) {
        return await this.moviesService.update(id, updateMovieDto);
    }
    async remove(id) {
        return await this.moviesService.remove(id);
    }
    async restore(id) {
        return await this.moviesService.restore(id);
    }
    async hardRemove(id) {
        return await this.moviesService.hardRemove(id);
    }
    async incrementViewCount(id) {
        return await this.moviesService.incrementViewCount(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateMovieDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Query('genre')),
    __param(1, Query('type')),
    __param(2, Query('level')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findAll", null);
__decorate([
    Get('search'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Query('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "search", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateMovieDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "remove", null);
__decorate([
    Post(':id/restore'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "restore", null);
__decorate([
    Delete(':id/hard'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "hardRemove", null);
__decorate([
    Patch(':id/view'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "incrementViewCount", null);
MoviesController = __decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('movies'),
    __metadata("design:paramtypes", [MoviesService])
], MoviesController);
export { MoviesController };
//# sourceMappingURL=movies.controller.js.map