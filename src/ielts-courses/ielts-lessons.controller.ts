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
import { CreateLessonDto } from "./dto/create-lesson.dto.js";
import { UpdateLessonDto } from "./dto/update-lesson.dto.js";
import { LessonQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Lessons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-lessons")
export class IeltsLessonsController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new lesson" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Lesson created." })
  async create(@Body() dto: CreateLessonDto) {
    return await this.ieltsCoursesService.createLesson(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all lessons" })
  async findAll(@Query() query: LessonQueryDto) {
    return await this.ieltsCoursesService.findAllLessons(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a lesson by ID" })
  @ApiParam({ name: "id", description: "Lesson ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findLessonById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a lesson" })
  @ApiParam({ name: "id", description: "Lesson ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateLessonDto) {
    return await this.ieltsCoursesService.updateLesson(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a lesson" })
  @ApiParam({ name: "id", description: "Lesson ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsCoursesService.deleteLesson(id);
  }
}
