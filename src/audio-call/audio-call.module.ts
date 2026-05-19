import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import type { StringValue } from "ms";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { CallLog } from "./entities/call-log.entity.js";
import { User } from "../users/entities/user.entity.js";
import { CallLogService } from "./call-log.service.js";
import { OpenAiRealtimeService } from "./openai-realtime.service.js";
import { AudioCallGateway } from "./audio-call.gateway.js";
import { AudioCallController } from "./audio-call.controller.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";

@Module({
  imports: [
    ConfigModule,
    StudentProfileModule,
    SequelizeModule.forFeature([CallLog, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "your-secret-key",
        signOptions: {
          expiresIn: (configService.get<string>("JWT_EXPIRY") ||
            "1h") as StringValue,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AudioCallController],
  providers: [CallLogService, OpenAiRealtimeService, AudioCallGateway],
  exports: [CallLogService],
})
export class AudioCallModule {}
