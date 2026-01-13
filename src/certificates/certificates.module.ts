import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CertificatesService } from "./certificates.service.js";
import { CertificatesController } from "./certificates.controller.js";
import { Certificate } from "./entities/certificate.entity.js";
import { User } from "../users/entities/user.entity.js";
import { MinioModule } from "../minio/minio.module.js";

@Module({
  imports: [SequelizeModule.forFeature([Certificate, User]), MinioModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
