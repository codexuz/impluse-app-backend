var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentWalletService } from './student-wallet.service.js';
import { StudentWalletController } from './student-wallet.controller.js';
import { StudentWallet } from './entities/student-wallet.entity.js';
let StudentWalletModule = class StudentWalletModule {
};
StudentWalletModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([StudentWallet])],
        controllers: [StudentWalletController],
        providers: [StudentWalletService],
        exports: [StudentWalletService],
    })
], StudentWalletModule);
export { StudentWalletModule };
//# sourceMappingURL=student-wallet.module.js.map