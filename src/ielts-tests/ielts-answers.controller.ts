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
} from "@nestjs/swagger";
import { IeltsAnswersService } from "./ielts-answers.service.js";
import {
  CreateAttemptDto,
  SaveReadingAnswersDto,
  SaveListeningAnswersDto,
  SaveWritingAnswersDto,
  AttemptQueryDto,
  StatisticsQueryDto,
  UnfinishedQueryDto,
  GradeWritingAnswerDto,
  TeacherStudentsAttemptsQueryDto,
} from "./dto/ielts-answers.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Answers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-answers")
export class IeltsAnswersController {
  constructor(private readonly ieltsAnswersService: IeltsAnswersService) {}

  // ========== Attempts ==========

  @Post("attempts")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Create a new answer attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The attempt has been successfully created.",
  })
  async createAttempt(@CurrentUser() user: any, @Body() dto: CreateAttemptDto) {
    return await this.ieltsAnswersService.createAttempt(user.userId, dto);
  }

  @Get("attempts")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all attempts for the current user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all attempts for the user.",
  })
  async findAllAttempts(
    @CurrentUser() user: any,
    @Query() query: AttemptQueryDto,
  ) {
    return await this.ieltsAnswersService.findAllAttempts(user.userId, query);
  }

  @Get("attempts/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an attempt by ID with all answers" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async findAttemptById(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.findAttemptById(id, user.userId);
  }

  @Patch("attempts/:id/submit")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Submit an attempt" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async submitAttempt(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.submitAttempt(id, user.userId);
  }

  @Patch("attempts/:id/abandon")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Abandon an attempt" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async abandonAttempt(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.abandonAttempt(id, user.userId);
  }

  // ========== Statistics ==========

  @Get("statistics")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get IELTS test statistics for the current user",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Return statistics including scores, accuracy, and time spent.",
  })
  async getStatistics(
    @CurrentUser() user: any,
    @Query() query: StatisticsQueryDto,
  ) {
    return await this.ieltsAnswersService.getStatistics(user.userId, query);
  }

  // ========== Unfinished Tests ==========

  @Get("unfinished")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: "Get unfinished (in-progress) tests for the current user",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Return in-progress attempts with answer progress information.",
  })
  async getUnfinishedTests(
    @CurrentUser() user: any,
    @Query() query: UnfinishedQueryDto,
  ) {
    return await this.ieltsAnswersService.getUnfinishedTests(
      user.userId,
      query,
    );
  }

  @Get("my-students")
  @Roles(Role.TEACHER)
  @ApiOperation({
    summary: "Get all active students for the current teacher",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all active students across teacher's groups.",
  })
  async getMyStudents(@CurrentUser() user: any) {
    return await this.ieltsAnswersService.getMyStudents(user.userId);
  }

  @Get("my-students-attempts-results")
  @Roles(Role.TEACHER)
  @ApiOperation({
    summary:
      "Get my students submitted attempt results and writing tasks pending grading",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Return students' submitted attempt results and writing answers without scores.",
  })
  async getMyStudentsAttemptsResultsAndWritingToGrade(
    @CurrentUser() user: any,
    @Query() query: TeacherStudentsAttemptsQueryDto,
  ) {
    return await this.ieltsAnswersService.getMyStudentsAttemptsResultsAndWritingToGrade(
      user.userId,
      query,
    );
  }

  // ========== Reading Answers ==========

  @Post("reading")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Save reading answers for an attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Reading answers saved successfully.",
  })
  async saveReadingAnswers(
    @CurrentUser() user: any,
    @Body() dto: SaveReadingAnswersDto,
  ) {
    return await this.ieltsAnswersService.saveReadingAnswers(user.userId, dto);
  }

  @Get("reading/:attemptId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get reading answers for an attempt" })
  @ApiParam({ name: "attemptId", description: "The attempt ID" })
  async getReadingAnswers(
    @CurrentUser() user: any,
    @Param("attemptId") attemptId: string,
  ) {
    return await this.ieltsAnswersService.getReadingAnswers(
      attemptId,
      user.userId,
    );
  }

  // ========== Listening Answers ==========

  @Post("listening")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Save listening answers for an attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Listening answers saved successfully.",
  })
  async saveListeningAnswers(
    @CurrentUser() user: any,
    @Body() dto: SaveListeningAnswersDto,
  ) {
    return await this.ieltsAnswersService.saveListeningAnswers(
      user.userId,
      dto,
    );
  }

  @Get("listening/:attemptId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get listening answers for an attempt" })
  @ApiParam({ name: "attemptId", description: "The attempt ID" })
  async getListeningAnswers(
    @CurrentUser() user: any,
    @Param("attemptId") attemptId: string,
  ) {
    return await this.ieltsAnswersService.getListeningAnswers(
      attemptId,
      user.userId,
    );
  }

  // ========== Writing Answers ==========

  @Post("writing")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Save writing answers for an attempt" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Writing answers saved successfully.",
  })
  async saveWritingAnswers(
    @CurrentUser() user: any,
    @Body() dto: SaveWritingAnswersDto,
  ) {
    return await this.ieltsAnswersService.saveWritingAnswers(user.userId, dto);
  }

  @Get("writing/:attemptId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get writing answers for an attempt" })
  @ApiParam({ name: "attemptId", description: "The attempt ID" })
  async getWritingAnswers(
    @CurrentUser() user: any,
    @Param("attemptId") attemptId: string,
  ) {
    return await this.ieltsAnswersService.getWritingAnswers(
      attemptId,
      user.userId,
    );
  }

  @Patch("writing/:answerId/grade")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: "Grade a writing answer with IELTS criteria scores and feedback",
  })
  @ApiParam({ name: "answerId", description: "The writing answer ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Writing answer graded successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Writing answer not found.",
  })
  async gradeWritingAnswer(
    @Param("answerId") answerId: string,
    @Body() dto: GradeWritingAnswerDto,
  ) {
    return await this.ieltsAnswersService.gradeWritingAnswer(answerId, dto);
  }
}
