import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PaymentActionsService } from "./payment-actions.service.js";
import { PaymentActionsController } from "./payment-actions.controller.js";
import { PaymentAction } from "./entities/payment-action.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { User } from "../users/entities/user.entity.js";

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentAction, StudentPayment, User]),
  ],
  controllers: [PaymentActionsController],
  providers: [PaymentActionsService],
  exports: [PaymentActionsService, SequelizeModule],
})
export class PaymentActionsModule {}
