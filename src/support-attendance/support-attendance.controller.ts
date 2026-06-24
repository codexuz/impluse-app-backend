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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from "@nestjs/swagger";
import { SupportAttendanceService } from "./support-attendance.service.js";
import {
  CreateSupportAttendanceDto,
  UpdateSupportAttendanceDto,
  BulkSupportAttendanceDto,
} from "./dto/index.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Support Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("support-attendance")
export class SupportAttendanceController {
  constructor(
    private readonly supportAttendanceService: SupportAttendanceService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "Mark support attendance for a single student" })
  create(@Body() dto: CreateSupportAttendanceDto) {
    return this.supportAttendanceService.create(dto);
  }

  @Post("bulk")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Mark support attendance for a whole group in one session",
  })
  markBulk(@Body() dto: BulkSupportAttendanceDto) {
    return this.supportAttendanceService.markBulk(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get support attendance records with optional filters" })
  @ApiQuery({ name: "group_id", required: false })
  @ApiQuery({ name: "student_id", required: false })
  @ApiQuery({ name: "support_teacher_id", required: false })
  @ApiQuery({ name: "status", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  findAll(
    @Query("group_id") group_id?: string,
    @Query("student_id") student_id?: string,
    @Query("support_teacher_id") support_teacher_id?: string,
    @Query("status") status?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.supportAttendanceService.findAll({
      group_id,
      student_id,
      support_teacher_id,
      status,
      startDate,
      endDate,
    });
  }

  @Get("stats")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "Get support attendance statistics" })
  @ApiQuery({ name: "group_id", required: false })
  @ApiQuery({ name: "student_id", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  getStats(
    @Query("group_id") group_id?: string,
    @Query("student_id") student_id?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.supportAttendanceService.getStats({
      group_id,
      student_id,
      startDate,
      endDate,
    });
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get support attendance by group ID" })
  @ApiParam({ name: "groupId", description: "Group ID" })
  findByGroup(@Param("groupId") groupId: string) {
    return this.supportAttendanceService.findByGroup(groupId);
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get support attendance by student ID" })
  @ApiParam({ name: "studentId", description: "Student ID" })
  findByStudent(@Param("studentId") studentId: string) {
    return this.supportAttendanceService.findByStudent(studentId);
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get support attendance by support teacher ID" })
  @ApiParam({ name: "teacherId", description: "Support teacher ID" })
  findByTeacher(@Param("teacherId") teacherId: string) {
    return this.supportAttendanceService.findByTeacher(teacherId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get a support attendance record by ID" })
  @ApiParam({ name: "id", description: "Support attendance ID" })
  findOne(@Param("id") id: string) {
    return this.supportAttendanceService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "Update a support attendance record" })
  @ApiParam({ name: "id", description: "Support attendance ID" })
  update(@Param("id") id: string, @Body() dto: UpdateSupportAttendanceDto) {
    return this.supportAttendanceService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "Delete a support attendance record" })
  @ApiParam({ name: "id", description: "Support attendance ID" })
  remove(@Param("id") id: string) {
    return this.supportAttendanceService.remove(id);
  }
}
