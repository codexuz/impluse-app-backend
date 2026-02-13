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
import { CreateMultipleChoiceQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { UpdateMultipleChoiceQuestionDto } from "./dto/update-multiple-choice-question.dto.js";
import { MultipleChoiceQuestionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Multiple Choice Questions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-multiple-choice-questions")
export class IeltsMultipleChoiceQuestionsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new multiple choice question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The multiple choice question has been successfully created.",
  })
  async create(@Body() createDto: CreateMultipleChoiceQuestionDto) {
    return await this.ieltsTestsService.createMultipleChoiceQuestion(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all multiple choice questions" })
  async findAll(@Query() query: MultipleChoiceQuestionQueryDto) {
    return await this.ieltsTestsService.findAllMultipleChoiceQuestions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a multiple choice question by ID" })
  @ApiParam({ name: "id", description: "The multiple choice question ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findMultipleChoiceQuestionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a multiple choice question" })
  @ApiParam({ name: "id", description: "The multiple choice question ID" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateMultipleChoiceQuestionDto,
  ) {
    return await this.ieltsTestsService.updateMultipleChoiceQuestion(
      id,
      updateDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a multiple choice question" })
  @ApiParam({ name: "id", description: "The multiple choice question ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteMultipleChoiceQuestion(id);
  }
}
