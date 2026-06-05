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
} from "@nestjs/common";
import { BonusPenaltyWalletService } from "./bonus-penalty-wallet.service.js";
import { CreateBonusPenaltyWalletDto } from "./dto/create-bonus-penalty-wallet.dto.js";
import { UpdateBonusPenaltyWalletDto } from "./dto/update-bonus-penalty-wallet.dto.js";
import { UpdateWalletAmountDto } from "./dto/update-wallet-amount.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";

@ApiTags("Bonus & Penalty Wallet")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("bonus-penalty-wallet")
export class BonusPenaltyWalletController {
  constructor(
    private readonly bonusPenaltyWalletService: BonusPenaltyWalletService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new bonus & penalty wallet" })
  create(@Body() createBonusPenaltyWalletDto: CreateBonusPenaltyWalletDto) {
    return this.bonusPenaltyWalletService.create(createBonusPenaltyWalletDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all bonus & penalty wallets" })
  findAll() {
    return this.bonusPenaltyWalletService.findAll();
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get bonus & penalty wallet by teacher ID" })
  @ApiParam({
    name: "teacherId",
    description: "Teacher ID (UUID)",
    type: "string",
  })
  findByTeacherId(@Param("teacherId") teacherId: string) {
    return this.bonusPenaltyWalletService.findByTeacherId(teacherId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get bonus & penalty wallet by ID" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  findOne(@Param("id") id: string) {
    return this.bonusPenaltyWalletService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update bonus & penalty wallet" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  update(
    @Param("id") id: string,
    @Body() updateBonusPenaltyWalletDto: UpdateBonusPenaltyWalletDto,
  ) {
    return this.bonusPenaltyWalletService.update(
      id,
      updateBonusPenaltyWalletDto,
    );
  }

  @Patch(":id/amount")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Add or deduct amount from bonus & penalty wallet",
  })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  updateAmount(
    @Param("id") id: string,
    @Body() updateWalletAmountDto: UpdateWalletAmountDto,
  ) {
    return this.bonusPenaltyWalletService.updateAmount(
      id,
      updateWalletAmountDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete bonus & penalty wallet (soft delete)" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  remove(@Param("id") id: string) {
    return this.bonusPenaltyWalletService.remove(id);
  }
}
