import {
  Controller,
  Get,
  Post,
  Patch,
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
  ApiQuery,
} from "@nestjs/swagger";
import { IeltsCoursesService } from "./ielts-courses.service.js";
import { CreateLessonProgressDto } from "./dto/create-lesson-progress.dto.js";
import { UpdateLessonProgressDto } from "./dto/update-lesson-progress.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Lesson Progress")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-lesson-progress")
export class IeltsLessonProgressController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Create lesson progress" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Lesson progress created.",
  })
  async create(@Body() dto: CreateLessonProgressDto) {
    return await this.ieltsCoursesService.createLessonProgress(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get lesson progress by user and lesson" })
  @ApiQuery({ name: "userId", description: "User ID" })
  @ApiQuery({ name: "lessonId", description: "Lesson ID" })
  async findOne(
    @Query("userId") userId: string,
    @Query("lessonId") lessonId: string,
  ) {
    return await this.ieltsCoursesService.findLessonProgress(userId, lessonId);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Update lesson progress" })
  @ApiParam({ name: "id", description: "Progress ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateLessonProgressDto) {
    return await this.ieltsCoursesService.updateLessonProgress(id, dto);
  }
}
