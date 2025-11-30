import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { AttendanceService } from "./attendance.service.js";
import { CreateAttendanceDto } from "./dto/create-attendance.dto.js";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto.js";
import {
  AttendanceResponseDto,
  AttendanceStatsDto,
} from "./dto/attendance-response.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new attendance record" })
  @ApiResponse({
    status: 201,
    description: "Attendance record created successfully.",
    type: AttendanceResponseDto,
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
  @ApiResponse({
    status: 409,
    description: "Conflict - Attendance record already exists.",
  })
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return await this.attendanceService.create(createAttendanceDto);
  }

  @Post("bulk")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Create multiple attendance records at once",
    description:
      "Efficiently create attendance records for multiple students. Teacher payment is processed individually for each present student.",
  })
  @ApiResponse({
    status: 201,
    description: "Bulk attendance records processed successfully.",
    schema: {
      type: "object",
      properties: {
        created: {
          type: "array",
          items: { $ref: "#/components/schemas/AttendanceResponseDto" },
          description: "Successfully created attendance records",
        },
        errors: {
          type: "array",
          items: {
            type: "object",
            properties: {
              student_id: { type: "string" },
              error: { type: "string" },
            },
          },
          description: "Failed attendance records with error details",
        },
        summary: {
          type: "object",
          properties: {
            total_processed: {
              type: "number",
              description: "Total number of records processed",
            },
            successful: {
              type: "number",
              description: "Number of successfully created records",
            },
            failed: { type: "number", description: "Number of failed records" },
          },
        },
      },
    },
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
  async createBulk(@Body() createAttendanceDtos: CreateAttendanceDto[]) {
    return await this.attendanceService.createBulk(createAttendanceDtos);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all attendance records" })
  @ApiResponse({
    status: 200,
    description: "Returns all attendance records.",
    type: [AttendanceResponseDto],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required.",
  })
  async findAll() {
    return await this.attendanceService.findAll();
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance records by group ID" })
  @ApiParam({ name: "groupId", description: "Group ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns attendance records for the specified group.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Group not found." })
  async findByGroup(@Param("groupId") groupId: string) {
    return await this.attendanceService.findByGroupId(groupId);
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get attendance records by student ID" })
  @ApiParam({ name: "studentId", description: "Student ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns attendance records for the specified student.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Student not found." })
  async findByStudent(@Param("studentId") studentId: string) {
    return await this.attendanceService.findByStudentId(studentId);
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance records by teacher ID" })
  @ApiParam({ name: "teacherId", description: "Teacher ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns attendance records for the specified teacher.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Teacher not found." })
  async findByTeacher(@Param("teacherId") teacherId: string) {
    return await this.attendanceService.findByTeacherId(teacherId);
  }

  @Get("status/:status")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance records by status" })
  @ApiParam({
    name: "status",
    description: "Attendance status (present, absent, late)",
    enum: ["present", "absent", "late"],
  })
  @ApiResponse({
    status: 200,
    description: "Returns attendance records with the specified status.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByStatus(@Param("status") status: string) {
    return await this.attendanceService.findByStatus(status);
  }

  @Get("daterange")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance records by date range" })
  @ApiQuery({
    name: "startDate",
    description: "Start date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description: "Returns attendance records within the specified date range.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid date format.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByDateRange(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return await this.attendanceService.findByDateRange(startDate, endDate);
  }

  @Get("group/:groupId/daterange")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Get attendance records by group ID and date range",
  })
  @ApiParam({ name: "groupId", description: "Group ID", type: "string" })
  @ApiQuery({
    name: "startDate",
    description: "Start date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiResponse({
    status: 200,
    description:
      "Returns attendance records for the specified group within the date range.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid date format or group ID.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Group not found." })
  async findByGroupAndDateRange(
    @Param("groupId") groupId: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return await this.attendanceService.findByGroupAndDateRange(
      groupId,
      startDate,
      endDate
    );
  }

  @Get("student/:studentId/daterange")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get attendance records by student ID and date range",
  })
  @ApiParam({ name: "studentId", description: "Student ID", type: "string" })
  @ApiQuery({
    name: "startDate",
    description: "Start date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (YYYY-MM-DD)",
    type: "string",
  })
  @ApiQuery({
    name: "teacherId",
    description: "Teacher ID (optional)",
    type: "string",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      "Returns attendance records for the specified student within the date range.",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid date format or student ID.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Student not found." })
  async findByStudentAndDateRange(
    @Param("studentId") studentId: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Query("teacherId") teacherId?: string
  ) {
    return await this.attendanceService.findByStudentAndDateRange(
      studentId,
      startDate,
      endDate,
      teacherId
    );
  }

  @Get("stats/summary")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance statistics" })
  @ApiQuery({
    name: "groupId",
    description: "Group ID (optional)",
    type: "string",
    required: false,
  })
  @ApiQuery({
    name: "studentId",
    description: "Student ID (optional)",
    type: "string",
    required: false,
  })
  @ApiQuery({
    name: "startDate",
    description: "Start date (YYYY-MM-DD) (optional)",
    type: "string",
    required: false,
  })
  @ApiQuery({
    name: "endDate",
    description: "End date (YYYY-MM-DD) (optional)",
    type: "string",
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: "Returns attendance statistics.",
    type: AttendanceStatsDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async getAttendanceStats(
    @Query("groupId") groupId?: string,
    @Query("studentId") studentId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    return await this.attendanceService.getAttendanceStats(
      groupId,
      studentId,
      startDate,
      endDate
    );
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get attendance record by ID" })
  @ApiParam({ name: "id", description: "Attendance record ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns the attendance record.",
    type: AttendanceResponseDto,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Attendance record not found." })
  async findOne(@Param("id") id: string) {
    return await this.attendanceService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update attendance record" })
  @ApiParam({ name: "id", description: "Attendance record ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Attendance record updated successfully.",
    type: AttendanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid input data.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Attendance record not found." })
  @ApiResponse({
    status: 409,
    description: "Conflict - Attendance record already exists.",
  })
  async update(
    @Param("id") id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto
  ) {
    return await this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK) // Changed from NO_CONTENT to OK to return a JSON response
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete attendance record" })
  @ApiParam({ name: "id", description: "Attendance record ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Attendance record deleted successfully.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Admin access required.",
  })
  @ApiResponse({ status: 404, description: "Attendance record not found." })
  async remove(@Param("id") id: string) {
    return await this.attendanceService.remove(id);
  }

  @Get("student/:studentId/current-month")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get student's attendance summary for current month",
  })
  @ApiParam({ name: "studentId", description: "Student ID", type: "string" })
  @ApiResponse({
    status: 200,
    description: "Returns present and absent count for the current month.",
    schema: {
      type: "object",
      properties: {
        month: { type: "string", example: "September 2025" },
        student_id: { type: "string", example: "student-123" },
        total: { type: "number", example: 15 },
        present: { type: "number", example: 12 },
        absent: { type: "number", example: 2 },
        late: { type: "number", example: 1 },
        attendanceRate: { type: "string", example: "86.67" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Student not found." })
  async getStudentCurrentMonthAttendance(
    @Param("studentId") studentId: string
  ) {
    return await this.attendanceService.getStudentCurrentMonthAttendance(
      studentId
    );
  }
}
