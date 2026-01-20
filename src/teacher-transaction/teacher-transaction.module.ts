import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { TeacherTransactionService } from "./teacher-transaction.service.js";
import { TeacherTransactionController } from "./teacher-transaction.controller.js";
import { TeacherTransaction } from "./entities/teacher-transaction.entity.js";
import { TeacherWalletModule } from "../teacher-wallet/teacher-wallet.module.js";

@Module({
  imports: [
    SequelizeModule.forFeature([TeacherTransaction]),
    TeacherWalletModule,
  ],
  controllers: [TeacherTransactionController],
  providers: [TeacherTransactionService],
  exports: [TeacherTransactionService],
})
export class TeacherTransactionModule {}
