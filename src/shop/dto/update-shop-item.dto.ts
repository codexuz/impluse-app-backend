import { PartialType } from "@nestjs/swagger";
import { CreateShopItemDto } from "./create-shop-item.dto.js";

export class UpdateShopItemDto extends PartialType(CreateShopItemDto) {}
