import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { LessonSchedulesService } from "./lesson-schedules.service.js";
import { CreateLessonScheduleDto } from "./dto/create-lesson-schedule.dto.js";
import { UpdateLessonScheduleDto } from "./dto/update-lesson-schedule.dto.js";
import { LessonScheduleResponseDto } from "./dto/lesson-schedule-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Lesson Schedules")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("lesson-schedules")
export class LessonSchedulesController {
  constructor(
    private readonly lessonSchedulesService: LessonSchedulesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new lesson schedule" })
  @ApiResponse({
    status: 201,
    description: "Lesson schedule created successfully.",
    type: LessonScheduleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions.",
  })
  async create(@Body() createLessonScheduleDto: CreateLessonScheduleDto) {
    return await this.lessonSchedulesService.create(createLessonScheduleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all lesson schedules" })
  @ApiResponse({
    status: 200,
    description: "Returns all lesson schedules.",
    type: [LessonScheduleResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Insufficient permissions.",
  })
  async findAll() {
    return await this.lessonSchedulesService.findAll();
  }

  @Get("active")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get all active lesson schedules (current and future)",
  })
  @ApiResponse({
    status: 200,
    description: "Returns all active lesson schedules.",
    type: [LessonScheduleResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findActiveSchedules() {
    return await this.lessonSchedulesService.findActiveSchedules();
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get lesson schedules by group ID" })
  @ApiParam({ name: "groupId", description: "Group ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns lesson schedules for the specified group.",
    type: [LessonScheduleResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Group not found." })
  async findByGroup(@Param("groupId") groupId: string) {
    return await this.lessonSchedulesService.findByGroupId(groupId);
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get lesson schedules by teacher ID" })
  @ApiParam({ name: "teacherId", description: "Teacher ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns lesson schedules for the specified teacher.",
    type: [LessonScheduleResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByTeacher(@Param("teacherId") teacherId: string) {
    return await this.lessonSchedulesService.findByTeacherId(teacherId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get lesson schedule by ID" })
  @ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns the lesson schedule.",
    type: LessonScheduleResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Lesson schedule not found." })
  async findOne(@Param("id") id: string) {
    return await this.lessonSchedulesService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update lesson schedule" })
  @ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Lesson schedule updated successfully.",
    type: LessonScheduleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Lesson schedule not found." })
  async update(
    @Param("id") id: string,
    @Body() updateLessonScheduleDto: UpdateLessonScheduleDto,
  ) {
    return await this.lessonSchedulesService.update(
      id,
      updateLessonScheduleDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete lesson schedule" })
  @ApiParam({ name: "id", description: "Lesson schedule ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Lesson schedule deleted successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required.",
  })
  @ApiResponse({ status: 404, description: "Lesson schedule not found." })
  async remove(@Param("id") id: string) {
    return await this.lessonSchedulesService.remove(id);
  }
}
