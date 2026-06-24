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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { SupportAssignmentsService } from "./support-assignments.service.js";
import {
  CreateSupportAssignmentDto,
  UpdateSupportAssignmentDto,
} from "./dto/index.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Support Assignments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("support-assignments")
export class SupportAssignmentsController {
  constructor(
    private readonly supportAssignmentsService: SupportAssignmentsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({
    summary: "Assign a support teacher to a group with recurring days and time",
  })
  create(@Body() dto: CreateSupportAssignmentDto) {
    return this.supportAssignmentsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get all support assignments (with optional filters)" })
  @ApiQuery({ name: "support_teacher_id", required: false })
  @ApiQuery({ name: "group_id", required: false })
  @ApiQuery({
    name: "days",
    required: false,
    enum: ["odd", "even", "every_day", "other_day"],
  })
  findAll(
    @Query("support_teacher_id") support_teacher_id?: string,
    @Query("group_id") group_id?: string,
    @Query("days") days?: string,
  ) {
    return this.supportAssignmentsService.findAll({
      support_teacher_id,
      group_id,
      days,
    });
  }

  @Get("teacher/:teacherId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get support assignments by support teacher ID" })
  @ApiParam({ name: "teacherId", description: "Support teacher ID" })
  findByTeacher(@Param("teacherId") teacherId: string) {
    return this.supportAssignmentsService.findByTeacher(teacherId);
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get support assignments by group ID" })
  @ApiParam({ name: "groupId", description: "Group ID" })
  findByGroup(@Param("groupId") groupId: string) {
    return this.supportAssignmentsService.findByGroup(groupId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: "Get a support assignment by ID" })
  @ApiParam({ name: "id", description: "Support assignment ID" })
  findOne(@Param("id") id: string) {
    return this.supportAssignmentsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update a support assignment" })
  @ApiParam({ name: "id", description: "Support assignment ID" })
  update(@Param("id") id: string, @Body() dto: UpdateSupportAssignmentDto) {
    return this.supportAssignmentsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Delete a support assignment" })
  @ApiParam({ name: "id", description: "Support assignment ID" })
  remove(@Param("id") id: string) {
    return this.supportAssignmentsService.remove(id);
  }
}
