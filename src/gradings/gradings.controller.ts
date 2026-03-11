import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { GradingsService } from "./gradings.service.js";
import { CreateGradingDto } from "./dto/create-grading.dto.js";
import { UpdateGradingDto } from "./dto/update-grading.dto.js";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { Grading } from "./entities/grading.entity.js";

@ApiTags("gradings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("gradings")
export class GradingsController {
  constructor(private readonly gradingsService: GradingsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new grading" })
  @ApiResponse({
    status: 201,
    description: "The grading has been successfully created.",
    type: Grading,
  })
  create(@Body() createGradingDto: CreateGradingDto) {
    return this.gradingsService.create(createGradingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all gradings" })
  @ApiQuery({
    name: "studentId",
    required: false,
    description: "Filter by Student ID",
  })
  @ApiQuery({
    name: "teacherId",
    required: false,
    description: "Filter by Teacher ID",
  })
  @ApiQuery({
    name: "groupId",
    required: false,
    description: "Filter by Group ID",
  })
  @ApiQuery({ name: "startDate", required: false, description: "Filter from start date (ISO string)" })
  @ApiQuery({ name: "endDate", required: false, description: "Filter to end date (ISO string)" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({
    status: 200,
    description: "Return all gradings.",
  })
  findAll(
    @Query("studentId") studentId?: string,
    @Query("teacherId") teacherId?: string,
    @Query("groupId") groupId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.gradingsService.findAll(
      studentId,
      teacherId,
      groupId,
      startDate,
      endDate,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get gradings by student ID" })
  @ApiQuery({ name: "startDate", required: false, description: "Filter from start date (ISO string)" })
  @ApiQuery({ name: "endDate", required: false, description: "Filter to end date (ISO string)" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({
    status: 200,
    description: "Return all gradings for the specified student.",
  })
  findByStudentId(
    @Param("studentId") studentId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.gradingsService.findByStudentId(
      studentId,
      startDate,
      endDate,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10
    );
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a grading by id" })
  @ApiResponse({
    status: 200,
    description: "Return the grading.",
    type: Grading,
  })
  @ApiResponse({ status: 404, description: "Grading not found" })
  findOne(@Param("id") id: string) {
    return this.gradingsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a grading" })
  @ApiResponse({
    status: 200,
    description: "The grading has been successfully updated.",
    type: Grading,
  })
  @ApiResponse({ status: 404, description: "Grading not found" })
  update(@Param("id") id: string, @Body() updateGradingDto: UpdateGradingDto) {
    return this.gradingsService.update(id, updateGradingDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a grading" })
  @ApiResponse({
    status: 200,
    description: "The grading has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Grading not found" })
  remove(@Param("id") id: string) {
    return this.gradingsService.remove(id);
  }
}
