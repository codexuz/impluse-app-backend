import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { GroupStudentsService } from "./group-students.service.js";
import { CreateGroupStudentDto } from "./dto/create-group-student.dto.js";
import { UpdateGroupStudentDto } from "./dto/update-group-student.dto.js";
import { TransferStudentDto } from "./dto/transfer-student.dto.js";
import { GroupStudent } from "./entities/group-student.entity.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../auth/constants/roles.js";

@ApiTags("Group Students")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("group-students")
export class GroupStudentsController {
  constructor(private readonly groupStudentsService: GroupStudentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Add a student to a group" })
  @ApiResponse({
    status: 201,
    description: "The student has been successfully added to the group.",
    type: GroupStudent,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async create(
    @Body() createGroupStudentDto: CreateGroupStudentDto
  ): Promise<GroupStudent> {
    return await this.groupStudentsService.create(createGroupStudentDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all group student entries" })
  @ApiResponse({
    status: 200,
    description: "Return all group student entries.",
    type: [GroupStudent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findAll(): Promise<GroupStudent[]> {
    return await this.groupStudentsService.findAll();
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all students in a specific group" })
  @ApiResponse({
    status: 200,
    description: "Return all students in the group.",
    type: [GroupStudent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByGroupId(
    @Param("groupId") groupId: string
  ): Promise<GroupStudent[]> {
    return await this.groupStudentsService.findByGroupId(groupId);
  }

  @Get("group/:groupId/active")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all active students in a specific group" })
  @ApiResponse({
    status: 200,
    description: "Return all active students in the group.",
    type: [GroupStudent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findActiveByGroupId(
    @Param("groupId") groupId: string
  ): Promise<GroupStudent[]> {
    return await this.groupStudentsService.findActiveByGroupId(groupId);
  }

  @Get("student/:studentId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all groups for a specific student" })
  @ApiResponse({
    status: 200,
    description: "Return all groups the student is in.",
    type: [GroupStudent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async findByStudentId(
    @Param("studentId") studentId: string
  ): Promise<GroupStudent[]> {
    return await this.groupStudentsService.findByStudentId(studentId);
  }

  @Get("teacher/:teacherId/count")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Get the count of all active students for a specific teacher",
  })
  @ApiResponse({
    status: 200,
    description: "Return the count of active students for the teacher.",
    schema: { type: "object", properties: { count: { type: "number" } } },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async countStudentsByTeacher(
    @Param("teacherId") teacherId: string
  ): Promise<{ count: number }> {
    const count =
      await this.groupStudentsService.countStudentsByTeacher(teacherId);
    return { count };
  }

  @Get("teacher/:teacherId/students")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary:
      "Get all active students for a specific teacher across all their groups",
  })
  @ApiResponse({
    status: 200,
    description:
      "Return all active students for the teacher with group and student details.",
    type: [GroupStudent],
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  async getStudentsByTeacher(
    @Param("teacherId") teacherId: string
  ): Promise<GroupStudent[]> {
    return await this.groupStudentsService.getStudentsByTeacher(teacherId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get a group student entry by id" })
  @ApiResponse({
    status: 200,
    description: "Return the group student entry.",
    type: GroupStudent,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Group student entry not found." })
  async findOne(@Param("id") id: string): Promise<GroupStudent> {
    return await this.groupStudentsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a group student entry" })
  @ApiResponse({
    status: 200,
    description: "The group student entry has been successfully updated.",
    type: GroupStudent,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Group student entry not found." })
  async update(
    @Param("id") id: string,
    @Body() updateGroupStudentDto: UpdateGroupStudentDto
  ): Promise<GroupStudent> {
    return await this.groupStudentsService.update(id, updateGroupStudentDto);
  }

  @Patch(":id/status")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a student's status in the group" })
  @ApiResponse({
    status: 200,
    description: "The student's status has been successfully updated.",
    type: GroupStudent,
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Group student entry not found." })
  async updateStatus(
    @Param("id") id: string,
    @Body("status") status: string
  ): Promise<GroupStudent> {
    return await this.groupStudentsService.updateStatus(id, status);
  }

  @Post("transfer")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Transfer a student from one group to another",
    description:
      "Removes student from current group and adds them to new group in a single operation.",
  })
  @ApiResponse({
    status: 201,
    description: "The student has been successfully transferred.",
    schema: {
      type: "object",
      properties: {
        removed: {
          type: "object",
          description:
            "The student's record from the source group (now with 'removed' status)",
        },
        added: {
          type: "object",
          description: "The student's new record in the target group",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({
    status: 404,
    description: "Student not found in source group.",
  })
  @ApiResponse({
    status: 409,
    description: "Student already exists in target group.",
  })
  async transferStudent(
    @Body() transferStudentDto: TransferStudentDto
  ): Promise<{ removed: GroupStudent; added: GroupStudent }> {
    return await this.groupStudentsService.transferStudent(
      transferStudentDto.student_id,
      transferStudentDto.from_group_id,
      transferStudentDto.to_group_id
    );
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a group student entry" })
  @ApiResponse({
    status: 200,
    description: "The group student entry has been successfully deleted.",
  })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 404, description: "Group student entry not found." })
  async remove(
    @Param("id") id: string
  ): Promise<{ id: string; deleted: boolean }> {
    return await this.groupStudentsService.remove(id);
  }
}
