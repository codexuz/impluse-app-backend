import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AudioService } from "./audio.service.js";
import { AudioController } from "./audio.controller.js";
import { Audio } from "./entities/audio.entity.js";
import { AudioTask } from "./entities/audio-task.entity.js";
import { AudioLike } from "./entities/likes.js";
import { AudioComment } from "./entities/comments.js";
import { AudioJudge } from "./entities/judge.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";
import { FirebaseServiceService } from "../notifications/firebase-service.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { User } from "../users/entities/user.entity.js";
import { MinioModule } from "../minio/minio.module.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";
@Module({
  imports: [
    SequelizeModule.forFeature([
      Audio,
      AudioTask,
      AudioLike,
      AudioComment,
      AudioJudge,
      NotificationToken,
      User,
    ]),
    EventEmitterModule,
    StudentProfileModule,
    MinioModule,
    AwsStorageModule,
  ],
  controllers: [AudioController],
  providers: [
    AudioService,
    {
      provide: "AudioService",
      useExisting: AudioService,
    },
    FirebaseServiceService,
  ],
  exports: [AudioService],
})
export class AudioModule {}
