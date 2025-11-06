var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RBACSeeder } from './seeders/rbac.seeder.js';
import { Role } from '../users/entities/role.model.js';
import { Permission } from '../users/entities/permission.model.js';
import { UserRole } from '../users/entities/user-role.model.js';
import { RolePermission } from '../users/entities/role-permission.model.js';
import { User } from '../users/entities/user.entity.js';
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    Module({
        imports: [SequelizeModule.forFeature([
                User,
                Role,
                Permission,
                UserRole,
                RolePermission
            ])],
        providers: [RBACSeeder],
        exports: [RBACSeeder]
    })
], DatabaseModule);
export { DatabaseModule };
//# sourceMappingURL=database.module.js.map