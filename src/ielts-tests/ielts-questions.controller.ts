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
import { IeltsTestsService } from "./ielts-tests.service.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { UpdateQuestionDto } from "./dto/update-question.dto.js";
import { QuestionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Questions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-questions")
export class IeltsQuestionsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Create a new question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question has been successfully created.",
  })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.ieltsTestsService.createQuestion(createQuestionDto);
  }

  @Post(":id/ai-explain")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({
    summary:
      "Auto-generate explanation and fromPassage for a reading question (and its sub-questions/options) using AI",
  })
  @ApiParam({ name: "id", description: "The question ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "Explanation and fromPassage fields generated from the reading passage and saved.",
  })
  async aiExplain(@Param("id") id: string) {
    return await this.ieltsTestsService.generateReadingQuestionExplanation(id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all questions" })
  async findAll(@Query() query: QuestionQueryDto) {
    return await this.ieltsTestsService.findAllQuestions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a question by ID" })
  @ApiParam({ name: "id", description: "The question ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findQuestionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Update a question" })
  @ApiParam({ name: "id", description: "The question ID" })
  async update(
    @Param("id") id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.ieltsTestsService.updateQuestion(id, updateQuestionDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Delete a question" })
  @ApiParam({ name: "id", description: "The question ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteQuestion(id);
  }
}
