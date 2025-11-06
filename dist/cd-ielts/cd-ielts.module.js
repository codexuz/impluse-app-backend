var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CdIeltsService } from './cd-ielts.service.js';
import { CdIeltsController } from './cd-ielts.controller.js';
import { CdIelts } from './entities/cd-ielt.entity.js';
import { CdRegister } from './entities/cd-register.entity.js';
import { User } from '../users/entities/user.entity.js';
let CdIeltsModule = class CdIeltsModule {
};
CdIeltsModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([CdIelts, CdRegister, User])
        ],
        controllers: [CdIeltsController],
        providers: [CdIeltsService],
        exports: [CdIeltsService]
    })
], CdIeltsModule);
export { CdIeltsModule };
//# sourceMappingURL=cd-ielts.module.js.map