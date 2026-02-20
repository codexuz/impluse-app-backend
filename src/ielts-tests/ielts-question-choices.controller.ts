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
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { UpdateQuestionOptionDto } from "./dto/update-question-option.dto.js";
import { QuestionOptionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Question Choices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-question-choices")
export class IeltsQuestionChoicesController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new question choice" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question choice has been successfully created.",
  })
  async create(@Body() createDto: CreateQuestionOptionDto) {
    return await this.ieltsTestsService.createQuestionOption(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all question choices" })
  async findAll(@Query() query: QuestionOptionQueryDto) {
    return await this.ieltsTestsService.findAllQuestionOptions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a question choice by ID" })
  @ApiParam({ name: "id", description: "The question choice ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findQuestionOptionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a question choice" })
  @ApiParam({ name: "id", description: "The question choice ID" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateQuestionOptionDto,
  ) {
    return await this.ieltsTestsService.updateQuestionOption(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a question choice" })
  @ApiParam({ name: "id", description: "The question choice ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteQuestionOption(id);
  }
}
