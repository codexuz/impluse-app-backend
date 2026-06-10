import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersService } from "./users.service.js";
import { UsersController } from "./users.controller.js";
import { User } from "./entities/user.entity.js";
import { Role } from "./entities/role.model.js";
import { UserRole } from "./entities/user-role.model.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { ArchivedStudent } from "./entities/archived-student.entity.js";
import { SmsVerification } from "./entities/sms-verification.model.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { StudentParent } from "../student-parents/entities/student_parents.entity.js";
import { TeacherWallet } from "../teacher-wallet/entities/teacher-wallet.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { StaffProfile } from "../staff-profile/entities/staff-profile.entity.js";
import { MinioModule } from "../minio/minio.module.js";
import { AwsStorageModule } from "../aws-storage/aws-storage.module.js";
import { BonusPenaltyModule } from "../bonus-penalty/bonus-penalty.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRole,
      StudentProfile,
      ArchivedStudent,
      GroupStudent,
      SmsVerification,
      StudentParent,
      TeacherWallet,
      TeacherProfile,
      StaffProfile,
    ]),
    MinioModule,
    AwsStorageModule,
    BonusPenaltyModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, SequelizeModule],
})
export class UsersModule {}
