import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from "@nestjs/swagger";
import { ShopService } from "./shop.service.js";
import { CreateShopItemDto } from "./dto/create-shop-item.dto.js";
import { UpdateShopItemDto } from "./dto/update-shop-item.dto.js";
import { CreatePurchaseDto } from "./dto/create-purchase.dto.js";
import { ReviewPurchaseDto } from "./dto/review-purchase.dto.js";
import { ExchangeDto } from "./dto/exchange.dto.js";
import { PurchaseStatus } from "./entities/shop-purchase.entity.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Shop")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("shop")
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // ---- Items ----

  @Post("items")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a shop item (admin)" })
  @ApiBody({ type: CreateShopItemDto })
  @ApiResponse({ status: 201, description: "Item created" })
  createItem(@Body() dto: CreateShopItemDto) {
    return this.shopService.createItem(dto);
  }

  @Get("items")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "List shop items" })
  @ApiQuery({
    name: "includeInactive",
    required: false,
    type: Boolean,
    description: "Admin only: include inactive items",
  })
  @ApiResponse({ status: 200, description: "Return shop items" })
  findAllItems(
    @Request() req,
    @Query("includeInactive") includeInactive?: string
  ) {
    // Only admins may see inactive items.
    const isAdmin = (req.user?.roles ?? []).some(role => [Role.ADMIN, Role.OWNER, Role.MANAGER].includes(role as any));
    return this.shopService.findAllItems(isAdmin && includeInactive === "true");
  }

  @Get("items/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a shop item by id" })
  @ApiParam({ name: "id", description: "Shop item ID" })
  @ApiResponse({ status: 200, description: "Return the shop item" })
  findItem(@Param("id") id: string) {
    return this.shopService.findItem(id);
  }

  @Patch("items/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update a shop item (admin)" })
  @ApiParam({ name: "id", description: "Shop item ID" })
  @ApiBody({ type: UpdateShopItemDto })
  @ApiResponse({ status: 200, description: "Item updated" })
  updateItem(@Param("id") id: string, @Body() dto: UpdateShopItemDto) {
    return this.shopService.updateItem(id, dto);
  }

  @Delete("items/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a shop item (admin)" })
  @ApiParam({ name: "id", description: "Shop item ID" })
  @ApiResponse({ status: 204, description: "Item deleted" })
  removeItem(@Param("id") id: string) {
    return this.shopService.removeItem(id);
  }

  // ---- Purchases ----

  @Post("purchases")
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Buy a shop item with coins (student)" })
  @ApiBody({ type: CreatePurchaseDto })
  @ApiResponse({ status: 201, description: "Purchase request created" })
  purchase(@Request() req, @Body() dto: CreatePurchaseDto) {
    return this.shopService.purchase(req.user.userId, dto);
  }

  @Get("purchases")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "List all purchase requests (admin)" })
  @ApiQuery({
    name: "status",
    required: false,
    enum: PurchaseStatus,
    description: "Filter by status",
  })
  @ApiResponse({ status: 200, description: "Return purchase requests" })
  findAllPurchases(@Query("status") status?: PurchaseStatus) {
    return this.shopService.findAllPurchases(status);
  }

  @Get("purchases/mine")
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: "List my purchase requests (student)" })
  @ApiResponse({ status: 200, description: "Return the student's purchases" })
  findMyPurchases(@Request() req) {
    return this.shopService.findPurchasesByUser(req.user.userId);
  }

  @Get("purchases/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Get a purchase request by id (admin)" })
  @ApiParam({ name: "id", description: "Purchase ID" })
  @ApiResponse({ status: 200, description: "Return the purchase" })
  findPurchase(@Param("id") id: string) {
    return this.shopService.findPurchase(id);
  }

  @Patch("purchases/:id/review")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({
    summary: "Approve, reject or mark delivered a purchase request (admin)",
  })
  @ApiParam({ name: "id", description: "Purchase ID" })
  @ApiBody({ type: ReviewPurchaseDto })
  @ApiResponse({ status: 200, description: "Purchase reviewed" })
  reviewPurchase(
    @Request() req,
    @Param("id") id: string,
    @Body() dto: ReviewPurchaseDto
  ) {
    return this.shopService.reviewPurchase(id, req.user.userId, dto);
  }

  // ---- Exchange ----

  @Post("exchange")
  @Roles(Role.STUDENT)
  @ApiOperation({
    summary:
      "Exchange points or streaks into coins (student). 1 coin = 10 streaks = 100 points.",
  })
  @ApiBody({ type: ExchangeDto })
  @ApiResponse({ status: 200, description: "Returns the updated profile" })
  @HttpCode(HttpStatus.OK)
  exchange(@Request() req, @Body() dto: ExchangeDto) {
    return this.shopService.exchangeToCoins(req.user.userId, dto);
  }
}
