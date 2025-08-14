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

@Module({
  imports: [
   ConfigModule,
   PassportModule,
   JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '30d') 
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
export class AuthModule {}
