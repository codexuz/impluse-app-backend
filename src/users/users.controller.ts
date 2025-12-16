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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { CreateTeacherDto } from "./dto/create-teacher.dto.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdatePasswordDto } from "./dto/update-password.dto.js";
import { UpdateAvatarDto } from "./dto/update-avatar.dto.js";
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
  getAllTeachers() {
    return this.usersService.getAllTeachers();
  }

  @Get("admins")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "List of all admin users" })
  getAllAdmins() {
    return this.usersService.getAllAdmins();
  }

  @Get("students")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all students" })
  @ApiResponse({ status: 200, description: "List of all students" })
  getAllStudents() {
    return this.usersService.getAllStudents();
  }

  @Get("students/archived")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get all archived students" })
  @ApiResponse({ status: 200, description: "List of all archived students (is_active = false)" })
  getArchivedStudents() {
    return this.usersService.getArchivedStudents();
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

  @Patch("students/:id/archive")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Archive a student" })
  @ApiResponse({ status: 200, description: "Student archived successfully (is_active = false)" })
  @ApiResponse({ status: 404, description: "Student not found" })
  archiveStudent(@Param("id") id: string) {
    return this.usersService.archiveStudent(id);
  }

  @Patch("students/:id/restore")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Restore an archived student to active status" })
  @ApiResponse({ status: 200, description: "Student restored successfully (is_active = true)" })
  @ApiResponse({ status: 404, description: "Student not found" })
  restoreStudent(@Param("id") id: string) {
    return this.usersService.restoreStudent(id);
  }

  @Patch(":id/update-password")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({ 
    summary: "Update user password",
    description: "Updates a user's password by their ID. Admins can update any user's password, while regular users can only update their own."
  })
  @ApiResponse({ status: 200, description: "Password updated successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  @ApiResponse({ status: 403, description: "Forbidden - insufficient permissions" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updatePassword(
    @Param("id") id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(
      id,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword
    );
  }

  @Post(":id/upload-avatar")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Upload user avatar image",
    description: "Upload an avatar image for the user. The image will be stored and the avatar_url will be updated."
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
      storage: diskStorage({
        destination: "./uploads/avatars",
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `avatar-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error("Only image files are allowed (jpg, jpeg, png, gif)"), false);
        }
      },
    })
  )
  async uploadAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.usersService.updateAvatar(id, file.filename);
  }

  @Patch(":id/avatar")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Update user avatar URL",
    description: "Update the user's avatar URL directly (if you already have the URL)"
  })
  @ApiResponse({ status: 200, description: "Avatar URL updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateAvatarUrl(
    @Param("id") id: string,
    @Body() updateAvatarDto: UpdateAvatarDto
  ) {
    return this.usersService.updateAvatarUrl(id, updateAvatarDto.avatar_url);
  }
}
