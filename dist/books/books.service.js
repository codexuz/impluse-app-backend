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
import { Book } from './entities/book.entity.js';
let BooksService = class BooksService {
    constructor(bookModel) {
        this.bookModel = bookModel;
    }
    async create(createBookDto) {
        return this.bookModel.create({ ...createBookDto, views: 0 });
    }
    async findAll() {
        return this.bookModel.findAll();
    }
    async findOne(id) {
        const book = await this.bookModel.findByPk(id);
        if (!book) {
            throw new NotFoundException(`Book with ID "${id}" not found`);
        }
        return this.incrementViewCount(id);
    }
    async findByLevel(level) {
        return this.bookModel.findAll({
            where: { level },
        });
    }
    async update(id, updateBookDto) {
        const book = await this.findOne(id);
        await book.update(updateBookDto);
        return book;
    }
    async remove(id) {
        const book = await this.findOne(id);
        await book.destroy();
    }
    async incrementViewCount(id) {
        const book = await this.bookModel.findByPk(id);
        if (!book) {
            throw new NotFoundException(`Book with ID "${id}" not found`);
        }
        await book.increment('views');
        return book.reload();
    }
};
BooksService = __decorate([
    Injectable(),
    __param(0, InjectModel(Book)),
    __metadata("design:paramtypes", [Object])
], BooksService);
export { BooksService };
//# sourceMappingURL=books.service.js.map