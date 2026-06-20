import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { IeltsSpeakingService } from "./ielts-speaking.service.js";
import {
  BulkCreateSpeakingQuestionsDto,
  CreateSpeakingDto,
  CreateSpeakingPartDto,
  CreateSpeakingQuestionDto,
  SpeakingAttemptQueryDto,
  SpeakingPartQueryDto,
  SpeakingQueryDto,
  SpeakingQuestionQueryDto,
  UpdateSpeakingDto,
  UpdateSpeakingPartDto,
  UpdateSpeakingQuestionDto,
} from "./dto/speaking.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Speaking")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-speaking")
export class IeltsSpeakingController {
  constructor(private readonly speakingService: IeltsSpeakingService) {}

  // ========== Parts ==========
  @Post("part")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Create a speaking part (Part 1/2/3)" })
  async createPart(@Body() dto: CreateSpeakingPartDto) {
    return this.speakingService.createPart(dto);
  }

  @Get("parts")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "List speaking parts" })
  async findAllParts(@Query() query: SpeakingPartQueryDto) {
    return this.speakingService.findAllParts(query);
  }

  @Get("part/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a speaking part by ID" })
  @ApiParam({ name: "id" })
  async findPartById(@Param("id") id: string) {
    return this.speakingService.findPartById(id);
  }

  @Patch("part/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Update a speaking part" })
  @ApiParam({ name: "id" })
  async updatePart(@Param("id") id: string, @Body() dto: UpdateSpeakingPartDto) {
    return this.speakingService.updatePart(id, dto);
  }

  @Delete("part/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a speaking part" })
  @ApiParam({ name: "id" })
  async deletePart(@Param("id") id: string) {
    return this.speakingService.deletePart(id);
  }

  // ========== Questions ==========
  @Post("question")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Create a speaking question" })
  async createQuestion(@Body() dto: CreateSpeakingQuestionDto) {
    return this.speakingService.createQuestion(dto);
  }

  @Post("questions/bulk")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Bulk create speaking questions for a part" })
  async bulkCreateQuestions(@Body() dto: BulkCreateSpeakingQuestionsDto) {
    return this.speakingService.bulkCreateQuestions(dto);
  }

  @Get("questions")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "List speaking questions" })
  async findAllQuestions(@Query() query: SpeakingQuestionQueryDto) {
    return this.speakingService.findAllQuestions(query);
  }

  @Patch("question/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Update a speaking question" })
  @ApiParam({ name: "id" })
  async updateQuestion(
    @Param("id") id: string,
    @Body() dto: UpdateSpeakingQuestionDto,
  ) {
    return this.speakingService.updateQuestion(id, dto);
  }

  @Delete("question/:id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a speaking question" })
  @ApiParam({ name: "id" })
  async deleteQuestion(@Param("id") id: string) {
    return this.speakingService.deleteQuestion(id);
  }

  // ========== Attempts (speaking session history) ==========
  @Get("me/attempts")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: "List my past speaking attempts (with feedback)" })
  async getMyAttempts(@Request() req, @Query() query: SpeakingAttemptQueryDto) {
    return this.speakingService.getMyAttempts(req.user.userId, query);
  }

  @Get("attempt/:id")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN, Role.OWNER, Role.MANAGER, Role.SUPPORT_TEACHER)
  @ApiOperation({
    summary: "Get a speaking attempt (transcript + feedback). Owner or staff only.",
  })
  @ApiParam({ name: "id" })
  async getAttemptById(@Request() req, @Param("id") id: string) {
    return this.speakingService.getAttemptById(
      id,
      req.user.userId,
      req.user.roles ?? [],
    );
  }

  // ========== Topics ==========
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Create a speaking topic" })
  async createSpeaking(@Body() dto: CreateSpeakingDto) {
    return this.speakingService.createSpeaking(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "List speaking topics" })
  async findAllSpeakings(@Query() query: SpeakingQueryDto) {
    return this.speakingService.findAllSpeakings(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a speaking topic with its parts and questions" })
  @ApiParam({ name: "id" })
  async findSpeakingById(@Param("id") id: string) {
    return this.speakingService.findSpeakingById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Update a speaking topic" })
  @ApiParam({ name: "id" })
  async updateSpeaking(@Param("id") id: string, @Body() dto: UpdateSpeakingDto) {
    return this.speakingService.updateSpeaking(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a speaking topic" })
  @ApiParam({ name: "id" })
  async deleteSpeaking(@Param("id") id: string) {
    return this.speakingService.deleteSpeaking(id);
  }
}
