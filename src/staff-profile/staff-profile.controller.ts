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
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Staff Profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("staff-profile")
export class StaffProfileController {
  constructor(private readonly staffProfileService: StaffProfileService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a staff profile (Admin only)" })
  async create(@Body() dto: CreateStaffProfileDto) {
    return this.staffProfileService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "List all staff profiles (Admin only)" })
  async findAll() {
    return this.staffProfileService.findAll();
  }

  @Get("staff/:staffId")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get a staff profile by staff (user) ID (Admin only)" })
  async findByStaffId(@Param("staffId") staffId: string) {
    return this.staffProfileService.findByStaffId(staffId);
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get a staff profile by ID (Admin only)" })
  async findOne(@Param("id") id: string) {
    return this.staffProfileService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update a staff profile (Admin only)" })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateStaffProfileDto,
  ) {
    return this.staffProfileService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a staff profile (Admin only)" })
  async remove(@Param("id") id: string) {
    return this.staffProfileService.remove(id);
  }
}
