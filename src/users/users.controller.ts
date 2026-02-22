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
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdatePasswordDto } from "./dto/update-password.dto.js";
import { UpdateAvatarDto } from "./dto/update-avatar.dto.js";
import { CreateArchivedStudentDto } from "./dto/create-archived-student.dto.js";
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
  createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.usersService.createTeacher(createTeacherDto);
  }

  @Post("admins")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new admin user" })
  @ApiResponse({ status: 201, description: "Admin created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.createAdmin(createAdminDto);
  }

  @Get("teachers")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all teachers" })
  @ApiResponse({ status: 200, description: "List of all teachers" })
  getAllTeachers(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getAllTeachers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get("admins")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "List of all admin users" })
  getAllAdmins(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getAllAdmins(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get("students")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all students" })
  @ApiResponse({ status: 200, description: "List of all students" })
  getAllStudents(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getAllStudents(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get("students/archived")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all archived students" })
  @ApiResponse({
    status: 200,
    description: "List of all archived students (is_active = false)",
  })
  getArchivedStudents(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getArchivedStudents(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get("support-teachers")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all support teachers" })
  @ApiResponse({ status: 200, description: "List of all support teachers" })
  getAllSupportTeachers(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getAllSupportTeachers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get("guest-students")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all guest students" })
  @ApiResponse({ status: 200, description: "List of all guest students" })
  getAllGuestStudents(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("query") query?: string,
  ) {
    return this.usersService.getAllGuestStudents(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      query,
    );
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Delete(":id/hard")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Permanently delete a user and all associated data",
    description:
      "Permanently deletes a user and ALL related records (profiles, payments, attendance, sessions, etc.). This action is irreversible.",
  })
  @ApiResponse({
    status: 200,
    description: "User permanently deleted with all associations",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  hardDeleteUser(@Param("id") id: string) {
    return this.usersService.hardDeleteUser(id);
  }

  @Patch(":id/deactivate")
  @Roles(Role.ADMIN, Role.TEACHER)
  deactivate(@Param("id") id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(":id/activate")
  @Roles(Role.ADMIN, Role.TEACHER)
  activate(@Param("id") id: string) {
    return this.usersService.activate(id);
  }

  @Patch(":id/update-password")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Update user password",
    description:
      "Updates a user's password by their ID. Admins can update any user's password, while regular users can only update their own.",
  })
  @ApiResponse({ status: 200, description: "Password updated successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({
    status: 403,
    description: "Forbidden - insufficient permissions",
  })
  @ApiResponse({ status: 404, description: "User not found" })
  async updatePassword(
    @Param("id") id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(
      id,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  @Post(":id/upload-avatar")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Upload user avatar image",
    description:
      "Upload an avatar image for the user. The image will be stored in MinIO and the avatar_url will be updated.",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Avatar image file (jpg, jpeg, png, gif)",
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "Avatar uploaded successfully" })
  @ApiResponse({ status: 400, description: "Invalid file format" })
  @ApiResponse({ status: 404, description: "User not found" })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new Error("Only image files are allowed (jpg, jpeg, png, gif)"),
            false,
          );
        }
      },
    }),
  )
  async uploadAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatarToMinio(id, file);
  }

  @Patch(":id/avatar")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Update user avatar URL",
    description:
      "Update the user's avatar URL directly (if you already have the URL)",
  })
  @ApiResponse({ status: 200, description: "Avatar URL updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateAvatarUrl(
    @Param("id") id: string,
    @Body() updateAvatarDto: UpdateAvatarDto,
  ) {
    return this.usersService.updateAvatarUrl(id, updateAvatarDto.avatar_url);
  }

  // ==================== Archived Students ====================

  @Post("archived-students")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Archive a student" })
  @ApiResponse({ status: 201, description: "Student archived successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  createArchivedStudent(@Body() dto: CreateArchivedStudentDto) {
    return this.usersService.createArchivedStudent(dto);
  }

  @Get("archived-students")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all archived students" })
  @ApiResponse({ status: 200, description: "List of archived students" })
  findAllArchivedStudents(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("reason") reason?: string,
  ) {
    return this.usersService.findAllArchivedStudents(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      reason,
    );
  }

  @Get("archived-students/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get one archived student by ID" })
  @ApiResponse({ status: 200, description: "Archived student details" })
  @ApiResponse({ status: 404, description: "Not found" })
  findOneArchivedStudent(@Param("id") id: string) {
    return this.usersService.findOneArchivedStudent(id);
  }

  @Delete("archived-students/:id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an archived student record" })
  @ApiResponse({ status: 204, description: "Deleted successfully" })
  @ApiResponse({ status: 404, description: "Not found" })
  deleteArchivedStudent(@Param("id") id: string) {
    return this.usersService.deleteArchivedStudent(id);
  }
}
