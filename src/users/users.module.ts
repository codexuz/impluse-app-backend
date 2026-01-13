import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";
import { User } from "./entities/user.entity.js";
import { Role } from "./entities/role.model.js";
import { UserRole } from "./entities/user-role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { MinioModule } from "../minio/minio.module.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, StudentProfile]),
    MinioModule,
    AwsStorageModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule],
})
export class UsersModule {}
