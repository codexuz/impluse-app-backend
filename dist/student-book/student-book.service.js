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
import { StudentBook } from './entities/student-book.entity.js';
import { User } from '../users/entities/user.entity.js';
let StudentBookService = class StudentBookService {
    constructor(studentBookModel, userModel) {
        this.studentBookModel = studentBookModel;
        this.userModel = userModel;
    }
    async create(createStudentBookDto) {
        return this.studentBookModel.create({ ...createStudentBookDto });
    }
    async findAll() {
        return this.studentBookModel.findAll();
    }
    async findOne(id) {
        const studentBook = await this.studentBookModel.findByPk(id);
        if (!studentBook) {
            throw new NotFoundException('Student book not found');
        }
        return studentBook;
    }
    async findByStudentId(studentId) {
        const user = await this.userModel.findByPk(studentId, {
            attributes: ['level_id']
        });
        if (!user || !user.level_id) {
            return [];
        }
        return this.studentBookModel.findAll({
            where: {
                level_id: user.level_id
            }
        });
    }
    async findByStudentAndLevel(studentId, levelId) {
        const user = await this.userModel.findByPk(studentId, {
            attributes: ['level_id']
        });
        if (!user) {
            throw new NotFoundException('Student not found');
        }
        if (user.level_id !== levelId) {
            throw new NotFoundException('Student is not assigned to the specified level');
        }
        return this.studentBookModel.findAll({
            where: {
                level_id: levelId
            }
        });
    }
    async update(id, updateStudentBookDto) {
        const studentBook = await this.findOne(id);
        await studentBook.update(updateStudentBookDto);
        return studentBook;
    }
    async remove(id) {
        const studentBook = await this.findOne(id);
        await studentBook.destroy();
    }
};
StudentBookService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentBook)),
    __param(1, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object])
], StudentBookService);
export { StudentBookService };
//# sourceMappingURL=student-book.service.js.map