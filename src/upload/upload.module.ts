import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UploadController } from "./upload.controller.js";
import { UploadService } from "./upload.service.js";
import { Upload } from "./entities/upload.entity.js";
import { TimeoutMiddleware } from "./middleware/timeout.middleware.js";
import { MinioModule } from "../minio/minio.module.js";

@Module({
  imports: [SequelizeModule.forFeature([Upload]), MinioModule],
  controllers: [UploadController],
  providers: [UploadService, TimeoutMiddleware],
  exports: [UploadService], // Exporting UploadService if needed in other modules
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TimeoutMiddleware).forRoutes("upload");
  }
}
