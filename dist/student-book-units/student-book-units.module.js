var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { StudentBookUnitsService } from './student-book-units.service.js';
import { StudentBookUnitsController } from './student-book-units.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentBookUnit } from './entities/student-book-unit.entity.js';
let StudentBookUnitsModule = class StudentBookUnitsModule {
};
StudentBookUnitsModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([StudentBookUnit])],
        controllers: [StudentBookUnitsController],
        providers: [StudentBookUnitsService],
        exports: [StudentBookUnitsService],
    })
], StudentBookUnitsModule);
export { StudentBookUnitsModule };
//# sourceMappingURL=student-book-units.module.js.map