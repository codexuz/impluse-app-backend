import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
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
import { CreateQuizAttemptDto } from "./dto/create-quiz-attempt.dto.js";
import { CreateAttemptAnswerDto } from "./dto/create-attempt-answer.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Quiz Attempts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-quiz-attempts")
export class IeltsQuizAttemptsController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Start a quiz attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Quiz attempt started.",
  })
  async create(@Body() dto: CreateQuizAttemptDto) {
    return await this.ieltsCoursesService.createQuizAttempt(dto);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a quiz attempt by ID" })
  @ApiParam({ name: "id", description: "Attempt ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findQuizAttemptById(id);
  }

  @Patch(":id/submit")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Submit a quiz attempt" })
  @ApiParam({ name: "id", description: "Attempt ID" })
  async submit(@Param("id") id: string) {
    return await this.ieltsCoursesService.submitQuizAttempt(id);
  }

  @Post("answer")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Submit an answer for a quiz attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Answer submitted.",
  })
  async createAnswer(@Body() dto: CreateAttemptAnswerDto) {
    return await this.ieltsCoursesService.createAttemptAnswer(dto);
  }
}
