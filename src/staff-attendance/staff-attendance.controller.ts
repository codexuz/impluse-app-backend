import { Controller, Post, Body, UseGuards, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
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
}
