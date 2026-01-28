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
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from "@nestjs/common";
import { CoursesService } from "./courses.service.js";
import { CreateCourseDto } from "./dto/create-course.dto.js";
import { UpdateCourseDto } from "./dto/update-course.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.coursesService.create(createCourseDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async findAll(
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
    @Query("status", new ParseBoolPipe({ optional: true })) status?: boolean,
    @Query("search") search?: string,
  ) {
    return await this.coursesService.findAll(
      page || 1,
      limit || 10,
      status,
      search,
    );
  }

  @Get("progress/:studentId")
  @Roles("admin", "teacher", "student")
  async getCourseProgress(@Param("studentId") studentId: string) {
    return await this.coursesService.getCourseProgress(studentId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async findOne(@Param("id") id: string) {
    return await this.coursesService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  async update(
    @Param("id") id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return await this.coursesService.update(id, updateCourseDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  async remove(@Param("id") id: string) {
    return await this.coursesService.remove(id);
  }

  @Delete(":id/hard")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async hardRemove(@Param("id") id: string) {
    return await this.coursesService.hardRemove(id);
  }
}
