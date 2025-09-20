import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdatePasswordDto } from "./dto/update-password.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new teacher" })
  @ApiResponse({ status: 201, description: "Teacher created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  createTeacher(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createTeacher(createUserDto);
  }

  @Get("teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all teachers" })
  @ApiResponse({ status: 200, description: "List of all teachers" })
  getAllTeachers() {
    return this.usersService.getAllTeachers();
  }

  @Get("students")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all students" })
  @ApiResponse({ status: 200, description: "List of all students" })
  getAllStudents() {
    return this.usersService.getAllStudents();
  }

  @Get("support-teachers")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all support teachers" })
  @ApiResponse({ status: 200, description: "List of all support teachers" })
  getAllSupportTeachers() {
    return this.usersService.getAllSupportTeachers();
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Patch(":id/deactivate")
  @Roles(Role.ADMIN)
  deactivate(@Param("id") id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(":id/activate")
  @Roles(Role.ADMIN)
  activate(@Param("id") id: string) {
    return this.usersService.activate(id);
  }

  @Patch("update-password")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "Update user password" })
  @ApiResponse({ status: 200, description: "Password updated successfully" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: any
  ) {
    return this.usersService.updatePassword(
      user.userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword
    );
  }
}
