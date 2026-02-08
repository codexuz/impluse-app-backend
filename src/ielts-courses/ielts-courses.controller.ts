import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { IeltsCoursesService } from "./ielts-courses.service.js";
import { CreateIeltsCourseDto } from "./dto/create-ielts-course.dto.js";
import { UpdateIeltsCourseDto } from "./dto/update-ielts-course.dto.js";
import { CourseQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Courses")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-courses")
export class IeltsCoursesController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new course" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Course created." })
  async create(@Body() dto: CreateIeltsCourseDto) {
    return await this.ieltsCoursesService.createCourse(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all courses" })
  async findAll(@Query() query: CourseQueryDto) {
    return await this.ieltsCoursesService.findAllCourses(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a course by ID" })
  @ApiParam({ name: "id", description: "Course ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findCourseById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a course" })
  @ApiParam({ name: "id", description: "Course ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateIeltsCourseDto) {
    return await this.ieltsCoursesService.updateCourse(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a course" })
  @ApiParam({ name: "id", description: "Course ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsCoursesService.deleteCourse(id);
  }
}
