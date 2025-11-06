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
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentWallet } from './entities/student-wallet.entity.js';
let StudentWalletService = class StudentWalletService {
    constructor(studentWalletModel) {
        this.studentWalletModel = studentWalletModel;
    }
    async create(createStudentWalletDto) {
        const existingWallet = await this.studentWalletModel.findOne({
            where: { student_id: createStudentWalletDto.student_id },
        });
        if (existingWallet) {
            throw new ConflictException('Wallet already exists for this student');
        }
        return await this.studentWalletModel.create(createStudentWalletDto);
    }
    async findAll() {
        return await this.studentWalletModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }
    async findByStudentId(studentId) {
        const wallet = await this.studentWalletModel.findOne({
            where: { student_id: studentId },
        });
        if (!wallet) {
            throw new NotFoundException(`Wallet for student with ID "${studentId}" not found`);
        }
        return wallet;
    }
    async findOne(id) {
        const wallet = await this.studentWalletModel.findByPk(id);
        if (!wallet) {
            throw new NotFoundException(`Student wallet with ID "${id}" not found`);
        }
        return wallet;
    }
    async update(id, updateStudentWalletDto) {
        const wallet = await this.findOne(id);
        await wallet.update(updateStudentWalletDto);
        return wallet;
    }
    async updateAmount(id, updateWalletAmountDto) {
        const wallet = await this.findOne(id);
        const newAmount = wallet.amount + updateWalletAmountDto.amount;
        if (newAmount < 0) {
            throw new BadRequestException('Insufficient wallet balance');
        }
        await wallet.update({ amount: newAmount });
        return wallet;
    }
    async remove(id) {
        const wallet = await this.findOne(id);
        await wallet.destroy();
    }
};
StudentWalletService = __decorate([
    Injectable(),
    __param(0, InjectModel(StudentWallet)),
    __metadata("design:paramtypes", [Object])
], StudentWalletService);
export { StudentWalletService };
//# sourceMappingURL=student-wallet.service.js.map