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
import { TeacherTransaction } from './entities/teacher-transaction.entity.js';
let TeacherTransactionService = class TeacherTransactionService {
    constructor(teacherTransactionModel) {
        this.teacherTransactionModel = teacherTransactionModel;
    }
    async create(createTeacherTransactionDto) {
        return await this.teacherTransactionModel.create(createTeacherTransactionDto);
    }
    async findAll(type) {
        const whereCondition = {};
        if (type) {
            whereCondition.type = type;
        }
        return await this.teacherTransactionModel.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
        });
    }
    async findByTeacherId(teacherId, type) {
        const whereCondition = { teacher_id: teacherId };
        if (type) {
            whereCondition.type = type;
        }
        const transactions = await this.teacherTransactionModel.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
        });
        if (!transactions || transactions.length === 0) {
            throw new NotFoundException(`No transactions found for teacher with ID "${teacherId}"`);
        }
        return transactions;
    }
    async findOne(id) {
        const transaction = await this.teacherTransactionModel.findByPk(id);
        if (!transaction) {
            throw new NotFoundException(`Teacher transaction with ID "${id}" not found`);
        }
        return transaction;
    }
    async update(id, updateTeacherTransactionDto) {
        const transaction = await this.findOne(id);
        await transaction.update(updateTeacherTransactionDto);
        return transaction;
    }
    async remove(id) {
        const transaction = await this.findOne(id);
        await transaction.destroy();
    }
};
TeacherTransactionService = __decorate([
    Injectable(),
    __param(0, InjectModel(TeacherTransaction)),
    __metadata("design:paramtypes", [Object])
], TeacherTransactionService);
export { TeacherTransactionService };
//# sourceMappingURL=teacher-transaction.service.js.map