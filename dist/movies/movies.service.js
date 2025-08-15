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
import { Movie } from './entities/movie.entity.js';
import { Op } from 'sequelize';
let MoviesService = class MoviesService {
    constructor(movieModel) {
        this.movieModel = movieModel;
    }
    async create(createMovieDto) {
        return await this.movieModel.create({
            ...createMovieDto,
            views: 0,
        });
    }
    async findAll(query) {
        const where = {};
        if (query?.genre) {
            where.genre = query.genre;
        }
        if (query?.type) {
            where.type = query.type;
        }
        if (query?.level) {
            where.level = query.level;
        }
        return await this.movieModel.findAll({
            where,
            order: [['created_at', 'DESC']],
        });
    }
    async search(searchTerm) {
        return await this.movieModel.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${searchTerm}%`,
                },
            },
            order: [['title', 'ASC']],
        });
    }
    async findOne(id) {
        const movie = await this.movieModel.findByPk(id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return this.incrementViewCount(id);
    }
    async update(id, updateMovieDto) {
        const movie = await this.findOne(id);
        await movie.update(updateMovieDto);
        return movie;
    }
    async remove(id) {
        const movie = await this.findOne(id);
        await movie.destroy();
    }
    async restore(id) {
        const movie = await this.movieModel.findByPk(id, { paranoid: false });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        await movie.restore();
        return movie;
    }
    async hardRemove(id) {
        const movie = await this.findOne(id);
        await movie.destroy({ force: true });
    }
    async incrementViewCount(id) {
        const movie = await this.movieModel.findByPk(id);
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        await movie.increment('views');
        return movie.reload();
    }
};
MoviesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Movie)),
    __metadata("design:paramtypes", [Object])
], MoviesService);
export { MoviesService };
//# sourceMappingURL=movies.service.js.map