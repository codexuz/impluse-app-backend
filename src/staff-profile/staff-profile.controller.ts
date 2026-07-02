import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { StaffProfileService } from "./staff-profile.service.js";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto.js";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto.js";
import { CreateStaffShiftDto } from "./dto/create-staff-shift.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@ApiTags("Staff Profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("staff-profile")
export class StaffProfileController {
  constructor(private readonly staffProfileService: StaffProfileService) {}

  // ---------------------------------------------------------------------------
  // Profile endpoints
  // ---------------------------------------------------------------------------

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Create a staff profile (Admin only)" })
  async create(@Body() dto: CreateStaffProfileDto) {
    return this.staffProfileService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "List all staff profiles with their shifts (Admin only)" })
  async findAll() {
    return this.staffProfileService.findAll();
  }

  @Get("staff/:staffId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Get a staff profile by user ID (Admin only)" })
  async findByStaffId(@Param("staffId") staffId: string) {
    return this.staffProfileService.findByStaffId(staffId);
  }

  @Get("my-today-shifts")
  @Roles(Role.TEACHER, Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Get the authenticated staff member's shift times for today" })
  async getMyTodayShifts(@CurrentUser() user: any) {
    return this.staffProfileService.getTodayShifts(user.userId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Get a staff profile by profile ID (Admin only)" })
  async findOne(@Param("id") id: string) {
    return this.staffProfileService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update a staff profile (Admin only)" })
  async update(@Param("id") id: string, @Body() dto: UpdateStaffProfileDto) {
    return this.staffProfileService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Delete a staff profile and all its shifts (Admin only)" })
  async remove(@Param("id") id: string) {
    return this.staffProfileService.remove(id);
  }

  // ---------------------------------------------------------------------------
  // Shift endpoints  /staff-profile/:profileId/shifts
  // ---------------------------------------------------------------------------

  @Get(":profileId/shifts")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "List all shifts for a staff profile" })
  async getShifts(@Param("profileId") profileId: string) {
    return this.staffProfileService.getShifts(profileId);
  }

  @Post(":profileId/shifts")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Add a shift to a staff profile" })
  async addShift(
    @Param("profileId") profileId: string,
    @Body() dto: CreateStaffShiftDto,
  ) {
    return this.staffProfileService.addShift(profileId, dto);
  }

  @Patch("shifts/:shiftId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update a shift" })
  async updateShift(
    @Param("shiftId") shiftId: string,
    @Body() dto: Partial<CreateStaffShiftDto>,
  ) {
    return this.staffProfileService.updateShift(shiftId, dto);
  }

  @Delete("shifts/:shiftId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Delete a shift" })
  async removeShift(@Param("shiftId") shiftId: string) {
    return this.staffProfileService.removeShift(shiftId);
  }
}
