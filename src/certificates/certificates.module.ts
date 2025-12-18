import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CertificatesService } from "./certificates.service";
import { CertificatesController } from "./certificates.controller";
import { Certificate } from "./entities/certificate.entity.js";
import { User } from "../users/entities/user.entity.js";

@Module({
  imports: [SequelizeModule.forFeature([Certificate, User])],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
