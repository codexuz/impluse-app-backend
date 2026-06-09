import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ShopItem } from "./entities/shop-item.entity.js";
import { ShopPurchase } from "./entities/shop-purchase.entity.js";
import { StudentProfile } from "../student_profiles/entities/student_profile.entity.js";
import { ShopService } from "./shop.service.js";
import { ShopController } from "./shop.controller.js";

@Module({
  imports: [
    SequelizeModule.forFeature([ShopItem, ShopPurchase, StudentProfile]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
