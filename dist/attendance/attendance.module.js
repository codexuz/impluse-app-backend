var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AttendanceService } from "./attendance.service.js";
import { AttendanceController } from "./attendance.controller.js";
import { Attendance } from "./entities/attendance.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherTransaction } from "../teacher-transaction/entities/teacher-transaction.entity.js";
let AttendanceModule = class AttendanceModule {
};
AttendanceModule = __decorate([
    Module({
        imports: [
            SequelizeModule.forFeature([
                Attendance,
                TeacherProfile,
                TeacherWallet,
                TeacherTransaction,
            ]),
        ],
        controllers: [AttendanceController],
        providers: [AttendanceService],
        exports: [AttendanceService],
    })
], AttendanceModule);
export { AttendanceModule };
//# sourceMappingURL=attendance.module.js.map