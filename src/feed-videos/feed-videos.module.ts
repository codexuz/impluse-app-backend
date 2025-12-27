import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { FeedVideosService } from "./feed-videos.service.js";
import { FeedVideosController } from "./feed-videos.controller.js";
import { MinioService } from "./minio.service.js";
import { FeedVideo } from "./entities/feed-video.js";
import { FeedVideoTask } from "./entities/feed-video-task.entity.js";
import { VideoLike } from "./entities/likes.js";
import { VideoComment } from "./entities/comments.js";
import { VideoJudge } from "./entities/judge.js";
import { FeedVideoNotification } from "./entities/feed-video-notification.entity.js";
import { StudentProfileModule } from "../student_profiles/student-profile.module.js";
import { FirebaseServiceService } from "../notifications/firebase-service.service.js";
import { NotificationToken } from "../notifications/entities/notification-token.entity.js";
import { User } from "../users/entities/user.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      FeedVideo,
      FeedVideoTask,
      VideoLike,
      VideoComment,
      VideoJudge,
      FeedVideoNotification,
      NotificationToken,
      User,
    ]),
    StudentProfileModule,
  ],
  controllers: [FeedVideosController],
  providers: [FeedVideosService, MinioService, FirebaseServiceService],
  exports: [FeedVideosService, MinioService],
})
export class FeedVideosModule {}
