import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CertificatesService } from "./certificates.service.js";
import { CertificatesController } from "./certificates.controller.js";
import { Certificate } from "./entities/certificate.entity.js";
import { User } from "../users/entities/user.entity.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";

@Module({
  imports: [SequelizeModule.forFeature([Certificate, User]), AwsStorageModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
