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
import { CreateQuizQuestionDto } from "./dto/create-quiz-question.dto.js";
import { UpdateQuizQuestionDto } from "./dto/update-quiz-question.dto.js";
import { QuizQuestionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Quiz Questions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-quiz-questions")
export class IeltsQuizQuestionsController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new quiz question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Question created.",
  })
  async create(@Body() dto: CreateQuizQuestionDto) {
    return await this.ieltsCoursesService.createQuizQuestion(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all quiz questions" })
  async findAll(@Query() query: QuizQuestionQueryDto) {
    return await this.ieltsCoursesService.findAllQuizQuestions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a quiz question by ID" })
  @ApiParam({ name: "id", description: "Question ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findQuizQuestionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a quiz question" })
  @ApiParam({ name: "id", description: "Question ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateQuizQuestionDto) {
    return await this.ieltsCoursesService.updateQuizQuestion(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a quiz question" })
  @ApiParam({ name: "id", description: "Question ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsCoursesService.deleteQuizQuestion(id);
  }
}
