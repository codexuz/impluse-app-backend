import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
  Patch,
  Delete,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { StaffAttendanceService } from "./staff-attendance.service.js";
import { ScanStaffAttendanceDto } from "./dto/scan-staff-attendance.dto.js";
import { AttendancePolicyDto } from "./dto/attendance-policy.dto.js";
import { CreateStaffPermissionDto } from "./dto/create-staff-permission.dto.js";
import { ReviewStaffPermissionDto } from "./dto/review-staff-permission.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { User } from "../users/entities/user.entity.js";

@ApiTags("Staff Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("staff-attendance")
export class StaffAttendanceController {
  constructor(private readonly staffAttendanceService: StaffAttendanceService) {}

  // ---------------------------------------------------------------------------
  // QR helpers
  // ---------------------------------------------------------------------------

  @Get("qr-payload/:groupId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get QR code payload for a group (Admin only)" })
  async getQrPayload(@Param("groupId") groupId: string) {
    return this.staffAttendanceService.generateQrCodePayload(groupId);
  }

  @Get("static-qr/:teacherId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get static QR code payload for a teacher (Admin only)" })
  async getStaticQr(@Param("teacherId") teacherId: string) {
    return this.staffAttendanceService.generateStaticTeacherQrCode(teacherId);
  }

  // ---------------------------------------------------------------------------
  // Scan endpoints
  // ---------------------------------------------------------------------------

  @Post("automatic-scan")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Automatic attendance scan for Telegram bot" })
  async autoScan(@Body() body: { teacher_id: string; type?: "in" | "out" }) {
    return this.staffAttendanceService.automaticScan(body.teacher_id, body.type || "in");
  }

  @Post("scan")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Scan QR code to mark staff attendance" })
  async scan(@CurrentUser() user: User, @Body() scanDto: ScanStaffAttendanceDto) {
    return this.staffAttendanceService.scanQrCode(user.id, scanDto);
  }

  // ---------------------------------------------------------------------------
  // Query endpoints
  // ---------------------------------------------------------------------------

  @Get("my-attendances")
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: "Get my staff attendances" })
  async getMyAttendances(@CurrentUser() user: User) {
    return this.staffAttendanceService.getTeacherAttendances(user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "List all staff attendances (Admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "query", required: false, type: String })
  @ApiQuery({ name: "teacherId", required: false, type: String })
  @ApiQuery({ name: "groupId", required: false, type: String })
  @ApiQuery({ name: "status", required: false, enum: ["early", "on_time", "late", "excused"] })
  @ApiQuery({ name: "type", required: false, enum: ["in", "out"] })
  @ApiQuery({ name: "startDate", required: false, type: String })
  @ApiQuery({ name: "endDate", required: false, type: String })
  async getAllAttendances(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("query") query?: string,
    @Query("teacherId") teacherId?: string,
    @Query("groupId") groupId?: string,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.staffAttendanceService.getAllAttendances({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      query,
      teacherId,
      groupId,
      status,
      type,
      startDate,
      endDate,
    });
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  @Get("summary")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Attendance summary stats per staff for a date range" })
  @ApiQuery({ name: "startDate", required: true, type: String })
  @ApiQuery({ name: "endDate", required: true, type: String })
  @ApiQuery({ name: "teacherId", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getSummary(
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @Query("teacherId") teacherId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.staffAttendanceService.getSummary({
      startDate,
      endDate,
      teacherId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // ---------------------------------------------------------------------------
  // Audit log
  // ---------------------------------------------------------------------------

  @Get("events")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Raw audit event log (Admin only)" })
  @ApiQuery({ name: "staffId", required: false, type: String })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getEvents(
    @Query("staffId") staffId?: string,
    @Query("limit") limit?: string,
  ) {
    return this.staffAttendanceService.getAttendanceEvents(
      staffId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  // ---------------------------------------------------------------------------
  // Permissions / leave (ruxsat)
  // ---------------------------------------------------------------------------

  @Post("permissions")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Request a staff permission / leave (ruxsat)" })
  async createPermission(
    @CurrentUser() user: User,
    @Body() dto: CreateStaffPermissionDto,
  ) {
    return this.staffAttendanceService.createPermission(dto, user.id);
  }

  @Get("my-permissions")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get my permission / leave requests" })
  async getMyPermissions(@CurrentUser() user: User) {
    return this.staffAttendanceService.getStaffPermissions(user.id);
  }

  @Get("permissions")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "List staff permissions (Admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "staffId", required: false, type: String })
  @ApiQuery({ name: "status", required: false, enum: ["pending", "approved", "rejected"] })
  @ApiQuery({ name: "type", required: false, enum: ["full_day", "late_arrival", "early_leave"] })
  @ApiQuery({ name: "date", required: false, type: String, description: "YYYY-MM-DD — permissions active on this day" })
  async getPermissions(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("staffId") staffId?: string,
    @Query("status") status?: string,
    @Query("type") type?: string,
    @Query("date") date?: string,
  ) {
    return this.staffAttendanceService.getPermissions({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      staffId,
      status,
      type,
      date,
    });
  }

  @Patch("permissions/:id/review")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Approve or reject a permission (Admin only)" })
  async reviewPermission(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: ReviewStaffPermissionDto,
  ) {
    return this.staffAttendanceService.reviewPermission(id, dto, user.id);
  }

  @Patch("permissions/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Edit a pending permission" })
  async updatePermission(
    @Param("id") id: string,
    @Body() dto: CreateStaffPermissionDto,
  ) {
    return this.staffAttendanceService.updatePermission(id, dto);
  }

  @Delete("permissions/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a permission (Admin only)" })
  async deletePermission(@Param("id") id: string) {
    return this.staffAttendanceService.deletePermission(id);
  }

  // ---------------------------------------------------------------------------
  // Policy CRUD
  // ---------------------------------------------------------------------------

  @Get("policies")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "List fine policies (Admin only)" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async getPolicies(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.staffAttendanceService.getPolicies(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Post("policies")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a fine policy (Admin only)" })
  async createPolicy(@Body() dto: AttendancePolicyDto) {
    return this.staffAttendanceService.createPolicy(dto);
  }

  @Patch("policies/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a fine policy (Admin only)" })
  async updatePolicy(@Param("id") id: string, @Body() dto: AttendancePolicyDto) {
    return this.staffAttendanceService.updatePolicy(id, dto);
  }

  @Delete("policies/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Deactivate a fine policy (Admin only)" })
  async deletePolicy(@Param("id") id: string) {
    return this.staffAttendanceService.deletePolicy(id);
  }
}
