var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentProfile } from './entities/student_profile.entity.js';
import { StudentProfileService } from './student-profile.service.js';
import { StudentProfileController } from './student-profile.controller.js';
let StudentProfileModule = class StudentProfileModule {
};
StudentProfileModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([StudentProfile])],
        controllers: [StudentProfileController],
        providers: [StudentProfileService],
        exports: [StudentProfileService],
    })
], StudentProfileModule);
export { StudentProfileModule };
//# sourceMappingURL=student-profile.module.js.map