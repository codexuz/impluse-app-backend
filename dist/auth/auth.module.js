var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity.js';
import { Role } from '../users/entities/role.model.js';
import { UserRole } from '../users/entities/user-role.model.js';
import { UserSession } from '../users/entities/user-session.model.js';
import { Permission } from '../users/entities/permission.model.js';
import { RolePermission } from '../users/entities/role-permission.model.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            ConfigModule,
            PassportModule,
            JwtModule.registerAsync({
                imports: [ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN', '30d')
                    }
                }),
                inject: [ConfigService]
            }),
            SequelizeModule.forFeature([User, Role, UserRole, UserSession, Permission, RolePermission])
        ],
        controllers: [AuthController],
        providers: [AuthService, LocalStrategy, JwtStrategy],
        exports: [AuthService]
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map