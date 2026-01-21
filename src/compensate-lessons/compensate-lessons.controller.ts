import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { CompensateLessonsService } from "./compensate-lessons.service.js";
import { CreateCompensateLessonDto } from "./dto/create-compensate-lesson.dto.js";
import { UpdateCompensateLessonDto } from "./dto/update-compensate-lesson.dto.js";
import { CreateCompensateTeacherWalletDto } from "./dto/create-compensate-teacher-wallet.dto.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";

@ApiTags("compensate-lessons")
@Controller("compensate-lessons")
export class CompensateLessonsController {
  constructor(
    private readonly compensateLessonsService: CompensateLessonsService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new compensate lesson" })
  @ApiResponse({
    status: 201,
    description: "Compensate lesson created successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Compensate lesson already exists for this attendance",
  })
  create(@Body() createCompensateLessonDto: CreateCompensateLessonDto) {
    return this.compensateLessonsService.create(createCompensateLessonDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all compensate lessons for current teacher" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({ name: "teacher_id", required: false, type: String })
  @ApiQuery({ name: "student_id", required: false, type: String })
  @ApiQuery({ name: "compensated", required: false, type: Boolean })
  @ApiQuery({
    name: "start_date",
    required: false,
    type: String,
    description: "Filter by start date (ISO format)",
  })
  @ApiQuery({
    name: "end_date",
    required: false,
    type: String,
    description: "Filter by end date (ISO format)",
  })
  @ApiQuery({
    name: "student_search",
    required: false,
    type: String,
    description: "Search student by first name, last name, phone, or username",
  })
  findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("teacher_id") teacher_id?: string,
    @Query("student_id") student_id?: string,
    @Query("compensated") compensated?: string,
    @Query("start_date") start_date?: string,
    @Query("end_date") end_date?: string,
    @Query("student_search") student_search?: string,
  ) {
    return this.compensateLessonsService.findAll(+page, +limit, {
      teacher_id,
      student_id,
      compensated: compensated ? compensated === "true" : undefined,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      student_search,
    });
  }

  @Get("all-teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get all compensate lessons for all teachers (Admin only)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({ name: "teacher_id", required: false, type: String })
  @ApiQuery({ name: "student_id", required: false, type: String })
  @ApiQuery({ name: "compensated", required: false, type: Boolean })
  @ApiQuery({
    name: "start_date",
    required: false,
    type: String,
    description: "Filter by start date (ISO format)",
  })
  @ApiQuery({
    name: "end_date",
    required: false,
    type: String,
    description: "Filter by end date (ISO format)",
  })
  @ApiQuery({
    name: "student_search",
    required: false,
    type: String,
    description: "Search student by first name, last name, phone, or username",
  })
  findAllTeachers(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("teacher_id") teacher_id?: string,
    @Query("student_id") student_id?: string,
    @Query("compensated") compensated?: string,
    @Query("start_date") start_date?: string,
    @Query("end_date") end_date?: string,
    @Query("student_search") student_search?: string,
  ) {
    return this.compensateLessonsService.findAll(+page, +limit, {
      teacher_id,
      student_id,
      compensated: compensated ? compensated === "true" : undefined,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      student_search,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a compensate lesson by ID" })
  @ApiResponse({ status: 200, description: "Compensate lesson found" })
  @ApiResponse({ status: 404, description: "Compensate lesson not found" })
  findOne(@Param("id") id: string) {
    return this.compensateLessonsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a compensate lesson" })
  @ApiResponse({
    status: 200,
    description: "Compensate lesson updated successfully",
  })
  @ApiResponse({ status: 404, description: "Compensate lesson not found" })
  update(
    @Param("id") id: string,
    @Body() updateCompensateLessonDto: UpdateCompensateLessonDto,
  ) {
    return this.compensateLessonsService.update(id, updateCompensateLessonDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a compensate lesson" })
  @ApiResponse({
    status: 200,
    description: "Compensate lesson deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Compensate lesson not found" })
  remove(@Param("id") id: string) {
    return this.compensateLessonsService.remove(id);
  }

  // Compensate Teacher Wallet endpoints
  @Post("wallet")
  @ApiOperation({ summary: "Create a new wallet entry for compensate lesson" })
  @ApiResponse({
    status: 201,
    description: "Wallet entry created successfully",
  })
  createWalletEntry(
    @Body() createCompensateTeacherWalletDto: CreateCompensateTeacherWalletDto,
  ) {
    return this.compensateLessonsService.createWalletEntry(
      createCompensateTeacherWalletDto,
    );
  }

  @Get("wallet/all")
  @ApiOperation({ summary: "Get all wallet entries for current teacher" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({ name: "teacher_id", required: false, type: String })
  @ApiQuery({ name: "compensate_lesson_id", required: false, type: String })
  findAllWalletEntries(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("teacher_id") teacher_id?: string,
    @Query("compensate_lesson_id") compensate_lesson_id?: string,
  ) {
    return this.compensateLessonsService.findAllWalletEntries(+page, +limit, {
      teacher_id,
      compensate_lesson_id,
    });
  }

  @Get("wallet/all-teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get all wallet entries for all teachers (Admin only)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({ name: "teacher_id", required: false, type: String })
  @ApiQuery({ name: "compensate_lesson_id", required: false, type: String })
  findAllTeachersWalletEntries(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("teacher_id") teacher_id?: string,
    @Query("compensate_lesson_id") compensate_lesson_id?: string,
  ) {
    return this.compensateLessonsService.findAllWalletEntries(+page, +limit, {
      teacher_id,
      compensate_lesson_id,
    });
  }

  @Get("wallet/teacher/:teacherId")
  @ApiOperation({
    summary: "Get wallet entries for a specific teacher with date range",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({
    name: "startDate",
    required: false,
    type: String,
    description: "Filter by start date (ISO format)",
  })
  @ApiQuery({
    name: "endDate",
    required: false,
    type: String,
    description: "Filter by end date (ISO format)",
  })
  @ApiResponse({
    status: 200,
    description: "Teacher wallet entries retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Teacher not found" })
  getTeacherWalletWithDateRange(
    @Param("teacherId") teacherId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.compensateLessonsService.getTeacherWalletWithDateRange(
      teacherId,
      +page,
      +limit,
      start,
      end,
    );
  }

  @Get("wallet/:id")
  @ApiOperation({ summary: "Get a wallet entry by ID" })
  @ApiResponse({ status: 200, description: "Wallet entry found" })
  @ApiResponse({ status: 404, description: "Wallet entry not found" })
  findOneWalletEntry(@Param("id") id: string) {
    return this.compensateLessonsService.findOneWalletEntry(id);
  }

  @Patch("wallet/:id/mark-paid")
  @ApiOperation({ summary: "Mark a wallet entry as paid" })
  @ApiResponse({ status: 200, description: "Wallet entry marked as paid" })
  @ApiResponse({ status: 404, description: "Wallet entry not found" })
  markAsPaid(@Param("id") id: string) {
    return this.compensateLessonsService.markAsPaid(id);
  }
}
