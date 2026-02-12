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
import { CreateQuizDto } from "./dto/create-quiz.dto.js";
import { UpdateQuizDto } from "./dto/update-quiz.dto.js";
import { QuizQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Quizzes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-quizzes")
export class IeltsQuizzesController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new quiz" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Quiz created." })
  async create(@Body() dto: CreateQuizDto) {
    return await this.ieltsCoursesService.createQuiz(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all quizzes" })
  async findAll(@Query() query: QuizQueryDto) {
    return await this.ieltsCoursesService.findAllQuizzes(query);
  }

  @Get("lesson/:lessonId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a quiz by lesson ID" })
  @ApiParam({ name: "lessonId", description: "Lesson ID" })
  async findByLessonId(@Param("lessonId") lessonId: string) {
    return await this.ieltsCoursesService.findQuizByLessonId(lessonId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a quiz by ID" })
  @ApiParam({ name: "id", description: "Quiz ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findQuizById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a quiz" })
  @ApiParam({ name: "id", description: "Quiz ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateQuizDto) {
    return await this.ieltsCoursesService.updateQuiz(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a quiz" })
  @ApiParam({ name: "id", description: "Quiz ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsCoursesService.deleteQuiz(id);
  }
}
