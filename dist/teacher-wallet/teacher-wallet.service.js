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
import { TeacherWallet } from './entities/teacher-wallet.entity.js';
let TeacherWalletService = class TeacherWalletService {
    constructor(teacherWalletModel) {
        this.teacherWalletModel = teacherWalletModel;
    }
    async create(createTeacherWalletDto) {
        const existingWallet = await this.teacherWalletModel.findOne({
            where: { teacher_id: createTeacherWalletDto.teacher_id },
        });
        if (existingWallet) {
            throw new ConflictException('Wallet already exists for this teacher');
        }
        return await this.teacherWalletModel.create(createTeacherWalletDto);
    }
    async findAll() {
        return await this.teacherWalletModel.findAll({
            order: [['created_at', 'DESC']],
        });
    }
    async findByTeacherId(teacherId) {
        const wallet = await this.teacherWalletModel.findOne({
            where: { teacher_id: teacherId },
        });
        if (!wallet) {
            throw new NotFoundException(`Wallet for teacher with ID "${teacherId}" not found`);
        }
        return wallet;
    }
    async findOne(id) {
        const wallet = await this.teacherWalletModel.findByPk(id);
        if (!wallet) {
            throw new NotFoundException(`Teacher wallet with ID "${id}" not found`);
        }
        return wallet;
    }
    async update(id, updateTeacherWalletDto) {
        const wallet = await this.findOne(id);
        await wallet.update(updateTeacherWalletDto);
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
TeacherWalletService = __decorate([
    Injectable(),
    __param(0, InjectModel(TeacherWallet)),
    __metadata("design:paramtypes", [Object])
], TeacherWalletService);
export { TeacherWalletService };
//# sourceMappingURL=teacher-wallet.service.js.map