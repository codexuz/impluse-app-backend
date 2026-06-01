import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { StaffAttendanceService } from "./staff-attendance.service.js";
import { ScanStaffAttendanceDto } from "./dto/scan-staff-attendance.dto.js";
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
  constructor(
    private readonly staffAttendanceService: StaffAttendanceService,
  ) {}

  @Get("qr-payload/:groupId")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get QR code payload for a group (Admin only)",
  })
  async getQrPayload(@Param("groupId") groupId: string) {
    return this.staffAttendanceService.generateQrCodePayload(groupId);
  }

  @Get("static-qr/:teacherId")
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Get static QR code payload for a teacher (Admin only)",
  })
  async getStaticQr(@Param("teacherId") teacherId: string) {
    return this.staffAttendanceService.generateStaticTeacherQrCode(teacherId);
  }

  @Post("automatic-scan")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Automatic attendance scan for Telegram bot",
    description: "Finds the closest lesson for the teacher and takes attendance automatically based on their schedule.",
  })
  async autoScan(
    @Body() body: { teacher_id: string; type?: "in" | "out" },
  ) {
    return this.staffAttendanceService.automaticScan(body.teacher_id, body.type || "in");
  }

  @Post("scan")
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({
    summary: "Scan QR code to mark staff attendance",
    description:
      "Marks staff attendance. If scanned late compared to group lesson_start, deducts a fine from the teacher's wallet.",
  })
  async scan(
    @CurrentUser() user: User,
    @Body() scanDto: ScanStaffAttendanceDto,
  ) {
    return this.staffAttendanceService.scanQrCode(user.id, scanDto);
  }

  @Get("my-attendances")
  @Roles(Role.TEACHER)
  @ApiOperation({
    summary: "Get my staff attendances",
  })
  async getMyAttendances(@CurrentUser() user: User) {
    return this.staffAttendanceService.getTeacherAttendances(user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "List all staff attendances (Admin only)",
    description:
      "Paginated list of all staff attendance records with optional filters.",
  })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "query", required: false, type: String })
  @ApiQuery({ name: "teacherId", required: false, type: String })
  @ApiQuery({ name: "groupId", required: false, type: String })
  @ApiQuery({
    name: "status",
    required: false,
    enum: ["early", "on_time", "late"],
  })
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
}
