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
import { CreateSubQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { UpdateSubQuestionDto } from "./dto/update-multiple-choice-question.dto.js";
import { SubQuestionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Sub Questions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-sub-questions")
export class IeltsSubQuestionsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new sub question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The sub question has been successfully created.",
  })
  async create(@Body() createDto: CreateSubQuestionDto) {
    return await this.ieltsTestsService.createSubQuestion(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all sub questions" })
  async findAll(@Query() query: SubQuestionQueryDto) {
    return await this.ieltsTestsService.findAllSubQuestions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a sub question by ID" })
  @ApiParam({ name: "id", description: "The sub question ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findSubQuestionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a sub question" })
  @ApiParam({ name: "id", description: "The sub question ID" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateSubQuestionDto,
  ) {
    return await this.ieltsTestsService.updateSubQuestion(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a sub question" })
  @ApiParam({ name: "id", description: "The sub question ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteSubQuestion(id);
  }
}
