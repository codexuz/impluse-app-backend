var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserCourseService } from './user-course.service.js';
import { UserCourseController } from './user-course.controller.js';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserCourse } from './entities/user-course.entity.js';
let UserCourseModule = class UserCourseModule {
};
UserCourseModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([UserCourse]),
        ],
        controllers: [UserCourseController],
        providers: [UserCourseService],
        exports: [UserCourseService, SequelizeModule],
    })
], UserCourseModule);
export { UserCourseModule };
//# sourceMappingURL=user-course.module.js.map