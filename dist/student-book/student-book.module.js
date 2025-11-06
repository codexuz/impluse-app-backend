var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentBook } from './entities/student-book.entity.js';
import { User } from '../users/entities/user.entity.js';
import { StudentBookService } from './student-book.service.js';
import { StudentBookController } from './student-book.controller.js';
let StudentBookModule = class StudentBookModule {
};
StudentBookModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([StudentBook, User])],
        controllers: [StudentBookController],
        providers: [StudentBookService],
        exports: [StudentBookService],
    })
], StudentBookModule);
export { StudentBookModule };
//# sourceMappingURL=student-book.module.js.map