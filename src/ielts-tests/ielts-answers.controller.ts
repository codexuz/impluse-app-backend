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
    return await this.ieltsAnswersService.createAttempt(user.id, dto);
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
    return await this.ieltsAnswersService.findAllAttempts(user.id, query);
  }

  @Get("attempts/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an attempt by ID with all answers" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async findAttemptById(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.findAttemptById(id, user.id);
  }

  @Patch("attempts/:id/submit")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Submit an attempt" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async submitAttempt(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.submitAttempt(id, user.id);
  }

  @Patch("attempts/:id/abandon")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Abandon an attempt" })
  @ApiParam({ name: "id", description: "The attempt ID" })
  async abandonAttempt(@CurrentUser() user: any, @Param("id") id: string) {
    return await this.ieltsAnswersService.abandonAttempt(id, user.id);
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
    return await this.ieltsAnswersService.saveReadingAnswers(user.id, dto);
  }

  @Get("reading/:attemptId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get reading answers for an attempt" })
  @ApiParam({ name: "attemptId", description: "The attempt ID" })
  async getReadingAnswers(
    @CurrentUser() user: any,
    @Param("attemptId") attemptId: string,
  ) {
    return await this.ieltsAnswersService.getReadingAnswers(attemptId, user.id);
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
    return await this.ieltsAnswersService.saveListeningAnswers(user.id, dto);
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
      user.id,
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
    return await this.ieltsAnswersService.saveWritingAnswers(user.id, dto);
  }

  @Get("writing/:attemptId")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get writing answers for an attempt" })
  @ApiParam({ name: "attemptId", description: "The attempt ID" })
  async getWritingAnswers(
    @CurrentUser() user: any,
    @Param("attemptId") attemptId: string,
  ) {
    return await this.ieltsAnswersService.getWritingAnswers(attemptId, user.id);
  }
}
