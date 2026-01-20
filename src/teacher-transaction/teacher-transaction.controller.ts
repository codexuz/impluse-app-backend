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
import { TeacherTransactionService } from "./teacher-transaction.service.js";
import { CreateTeacherTransactionDto } from "./dto/create-teacher-transaction.dto.js";
import { UpdateTeacherTransactionDto } from "./dto/update-teacher-transaction.dto.js";
import { QueryTeacherTransactionDto } from "./dto/query-teacher-transaction.dto.js";
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

@ApiTags("Teacher Transaction")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("teacher-transaction")
export class TeacherTransactionController {
  constructor(
    private readonly teacherTransactionService: TeacherTransactionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new teacher transaction" })
  create(@Body() createTeacherTransactionDto: CreateTeacherTransactionDto) {
    return this.teacherTransactionService.create(createTeacherTransactionDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary:
      "Get all teacher transactions with pagination, filters, and student data",
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number",
    type: Number,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Items per page",
    type: Number,
  })
  @ApiQuery({
    name: "type",
    required: false,
    description: "Filter by transaction type",
    enum: ["kirim", "oylik", "avans", "bonus"],
  })
  @ApiQuery({
    name: "teacher_id",
    required: false,
    description: "Filter by teacher ID",
    type: String,
  })
  @ApiQuery({
    name: "student_id",
    required: false,
    description: "Filter by student ID",
    type: String,
  })
  @ApiQuery({
    name: "branch_id",
    required: false,
    description: "Filter by branch ID",
    type: String,
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Search in teacher/student names",
    type: String,
  })
  @ApiQuery({
    name: "start_date",
    required: false,
    description: "Start date (ISO 8601)",
    type: String,
  })
  @ApiQuery({
    name: "end_date",
    required: false,
    description: "End date (ISO 8601)",
    type: String,
  })
  findAll(@Query() queryDto: QueryTeacherTransactionDto) {
    return this.teacherTransactionService.findAll(queryDto);
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all transactions for a specific teacher" })
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
    return this.teacherTransactionService.findByTeacherId(teacherId, type);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get teacher transaction by ID" })
  @ApiParam({
    name: "id",
    description: "Transaction ID (UUID)",
    type: "string",
  })
  findOne(@Param("id") id: string) {
    return this.teacherTransactionService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update teacher transaction" })
  @ApiParam({
    name: "id",
    description: "Transaction ID (UUID)",
    type: "string",
  })
  update(
    @Param("id") id: string,
    @Body() updateTeacherTransactionDto: UpdateTeacherTransactionDto,
  ) {
    return this.teacherTransactionService.update(
      id,
      updateTeacherTransactionDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete teacher transaction (soft delete)" })
  @ApiParam({
    name: "id",
    description: "Transaction ID (UUID)",
    type: "string",
  })
  remove(@Param("id") id: string) {
    return this.teacherTransactionService.remove(id);
  }
}
