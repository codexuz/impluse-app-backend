var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherTransactionService } from './teacher-transaction.service.js';
import { TeacherTransactionController } from './teacher-transaction.controller.js';
import { TeacherTransaction } from './entities/teacher-transaction.entity.js';
let TeacherTransactionModule = class TeacherTransactionModule {
};
TeacherTransactionModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([TeacherTransaction])],
        controllers: [TeacherTransactionController],
        providers: [TeacherTransactionService],
        exports: [TeacherTransactionService],
    })
], TeacherTransactionModule);
export { TeacherTransactionModule };
//# sourceMappingURL=teacher-transaction.module.js.map