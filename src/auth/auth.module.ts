import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LocalStrategy } from "./strategies/local.strategy.js";
import { JwtStrategy } from "./strategies/jwt.strategy.js";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/entities/user.entity.js";
import { Role } from "../users/entities/role.model.js";
import { UserRole } from "../users/entities/user-role.model.js";
import { UserSession } from "../users/entities/user-session.model.js";
import { Permission } from "../users/entities/permission.model.js";
import { RolePermission } from "../users/entities/role-permission.model.js";
import { StudentWallet } from "../student-wallet/entities/student-wallet.entity.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { SmsVerification } from "../users/entities/sms-verification.model.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";
import { SmsModule } from "../sms/sms.module.js";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    AwsStorageModule,
    SmsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "30d"),
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      User,
      Role,
      UserRole,
      UserSession,
      Permission,
      RolePermission,
      StudentWallet,
      StudentParent,
      SmsVerification,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
