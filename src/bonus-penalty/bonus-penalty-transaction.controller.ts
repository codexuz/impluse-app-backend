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
import { BonusPenaltyTransactionService } from "./bonus-penalty-transaction.service.js";
import { CreateBonusPenaltyTransactionDto } from "./dto/create-bonus-penalty-transaction.dto.js";
import { UpdateBonusPenaltyTransactionDto } from "./dto/update-bonus-penalty-transaction.dto.js";
import { QueryBonusPenaltyTransactionDto } from "./dto/query-bonus-penalty-transaction.dto.js";
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

@ApiTags("Bonus & Penalty Transaction")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("bonus-penalty-transaction")
export class BonusPenaltyTransactionController {
  constructor(
    private readonly bonusPenaltyTransactionService: BonusPenaltyTransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({
    summary:
      "Create a new bonus / jarima (penalty) / referal transaction. Updates the teacher's bonus & penalty wallet.",
  })
  create(
    @Body() createBonusPenaltyTransactionDto: CreateBonusPenaltyTransactionDto,
  ) {
    return this.bonusPenaltyTransactionService.create(
      createBonusPenaltyTransactionDto,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({
    summary: "Get all bonus & penalty transactions with pagination and filters",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["bonus", "jarima", "referal"],
  })
  @ApiQuery({ name: "teacher_id", required: false, type: String })
  @ApiQuery({ name: "student_id", required: false, type: String })
  @ApiQuery({ name: "branch_id", required: false, type: String })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "start_date", required: false, type: String })
  @ApiQuery({ name: "end_date", required: false, type: String })
  findAll(@Query() queryDto: QueryBonusPenaltyTransactionDto) {
    return this.bonusPenaltyTransactionService.findAll(queryDto);
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({
    summary: "Get all bonus & penalty transactions for a specific teacher",
  })
  @ApiParam({
    name: "teacherId",
    description: "Teacher ID (UUID)",
    type: "string",
  })
  @ApiQuery({
    name: "type",
    required: false,
    description: "Filter by transaction type",
  })
  findByTeacherId(
    @Param("teacherId") teacherId: string,
    @Query("type") type?: string,
  ) {
    return this.bonusPenaltyTransactionService.findByTeacherId(teacherId, type);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Get bonus & penalty transaction by ID" })
  @ApiParam({ name: "id", description: "Transaction ID (UUID)", type: "string" })
  findOne(@Param("id") id: string) {
    return this.bonusPenaltyTransactionService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update bonus & penalty transaction" })
  @ApiParam({ name: "id", description: "Transaction ID (UUID)", type: "string" })
  update(
    @Param("id") id: string,
    @Body() updateBonusPenaltyTransactionDto: UpdateBonusPenaltyTransactionDto,
  ) {
    return this.bonusPenaltyTransactionService.update(
      id,
      updateBonusPenaltyTransactionDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({
    summary:
      "Delete bonus & penalty transaction (soft delete, reverses wallet balance)",
  })
  @ApiParam({ name: "id", description: "Transaction ID (UUID)", type: "string" })
  remove(@Param("id") id: string) {
    return this.bonusPenaltyTransactionService.remove(id);
  }
}
