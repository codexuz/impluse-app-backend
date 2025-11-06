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
import { StudentTransaction } from './entities/student-transaction.entity.js';
let StudentTransactionService = class StudentTransactionService {
    constructor(studentTransactionModel) {
        this.studentTransactionModel = studentTransactionModel;
    }
    async create(createStudentTransactionDto) {
        return await this.studentTransactionModel.create(createStudentTransactionDto);
    }
    async findAll(type) {
        const whereCondition = {};
        if (type) {
            whereCondition.type = type;
        }
        return await this.studentTransactionModel.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
        });
    }
    async findByStudentId(studentId, type) {
        const whereCondition = { student_id: studentId };
        if (type) {
            whereCondition.type = type;
        }
        const transactions = await this.studentTransactionModel.findAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
        });
        if (!transactions || transactions.length === 0) {
            throw new NotFoundException(`No transactions found for student with ID "${studentId}"`);
        }
        return transactions;
    }
    async findOne(id) {
        const transaction = await this.studentTransactionModel.findByPk(id);
        if (!transaction) {
            throw new NotFoundException(`Student transaction with ID "${id}" not found`);
        }
        return transaction;
    }
    async update(id, updateStudentTransactionDto) {
        const transaction = await this.findOne(id);
        await transaction.update(updateStudentTransactionDto);
        return transaction;
    }
    async remove(id) {
        const transaction = await this.findOne(id);
        await transaction.destroy();
    }
};
StudentTransactionService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentTransaction)),
    __metadata("design:paramtypes", [Object])
], StudentTransactionService);
export { StudentTransactionService };
//# sourceMappingURL=student-transaction.service.js.map