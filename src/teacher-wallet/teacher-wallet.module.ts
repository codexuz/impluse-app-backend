import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TeacherWalletService } from "./teacher-wallet.service.js";
import { TeacherWalletController } from "./teacher-wallet.controller.js";
import { TeacherWallet } from "./entities/teacher-wallet.entity.js";
import { User } from "../users/entities/user.entity.js";
import { TeacherProfile } from "../teacher-profile/entities/teacher-profile.entity.js";
import { Group } from "../groups/entities/group.entity.js";
import { GroupStudent } from "../group-students/entities/group-student.entity.js";
import { CompensateTeacherWallet } from "../compensate-lessons/entities/compensate-teacher-wallet.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([
      TeacherWallet,
      User,
      TeacherProfile,
      Group,
      GroupStudent,
      CompensateTeacherWallet,
    ]),
  ],
  controllers: [TeacherWalletController],
  providers: [TeacherWalletService],
  exports: [TeacherWalletService],
})
export class TeacherWalletModule {}
