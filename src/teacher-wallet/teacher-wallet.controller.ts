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
} from "@nestjs/common";
import { TeacherWalletService } from "./teacher-wallet.service.js";
import { CreateTeacherWalletDto } from "./dto/create-teacher-wallet.dto.js";
import { UpdateTeacherWalletDto } from "./dto/update-teacher-wallet.dto.js";
import { UpdateWalletAmountDto } from "./dto/update-wallet-amount.dto.js";
import { GetTeachersWithStatsDto } from "./dto/get-teachers-with-stats.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Teacher Wallet")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("teacher-wallet")
export class TeacherWalletController {
  constructor(private readonly teacherWalletService: TeacherWalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new teacher wallet" })
  create(@Body() createTeacherWalletDto: CreateTeacherWalletDto) {
    return this.teacherWalletService.create(createTeacherWalletDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all teacher wallets" })
  findAll() {
    return this.teacherWalletService.findAll();
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get wallet by teacher ID" })
  @ApiParam({
    name: "teacherId",
    description: "Teacher ID (UUID)",
    type: "string",
  })
  findByTeacherId(@Param("teacherId") teacherId: string) {
    return this.teacherWalletService.findByTeacherId(teacherId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get teacher wallet by ID" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  findOne(@Param("id") id: string) {
    return this.teacherWalletService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update teacher wallet" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  update(
    @Param("id") id: string,
    @Body() updateTeacherWalletDto: UpdateTeacherWalletDto,
  ) {
    return this.teacherWalletService.update(id, updateTeacherWalletDto);
  }

  @Patch(":id/amount")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Add or deduct amount from teacher wallet" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  updateAmount(
    @Param("id") id: string,
    @Body() updateWalletAmountDto: UpdateWalletAmountDto,
  ) {
    return this.teacherWalletService.updateAmount(id, updateWalletAmountDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete teacher wallet (soft delete)" })
  @ApiParam({ name: "id", description: "Wallet ID (UUID)", type: "string" })
  remove(@Param("id") id: string) {
    return this.teacherWalletService.remove(id);
  }

  @Get("stats/teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      "Get teachers with statistics (groups count, students count, wallet balance, compensate balance)",
  })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({
    name: "query",
    required: false,
    type: String,
    description: "Search by name, username, or phone",
  })
  @ApiQuery({
    name: "branch_id",
    required: false,
    type: String,
    description: "Filter by branch ID",
  })
  @ApiQuery({
    name: "payment_type",
    required: false,
    enum: ["percentage", "fixed"],
    description: "Filter by payment type",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    type: String,
    example: "created_at",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    enum: ["ASC", "DESC"],
    example: "DESC",
  })
  getTeachersWithStats(@Query() filters: GetTeachersWithStatsDto) {
    return this.teacherWalletService.getTeachersWithStats(filters);
  }
}
