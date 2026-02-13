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
import { CreateQuestionContentDto } from "./dto/create-question-content.dto.js";
import { UpdateQuestionContentDto } from "./dto/update-question-content.dto.js";
import { QuestionContentQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Question Contents")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-question-contents")
export class IeltsQuestionContentsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new question content" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question content has been successfully created.",
  })
  async create(@Body() createDto: CreateQuestionContentDto) {
    return await this.ieltsTestsService.createQuestionContent(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all question contents" })
  async findAll(@Query() query: QuestionContentQueryDto) {
    return await this.ieltsTestsService.findAllQuestionContents(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a question content by ID" })
  @ApiParam({ name: "id", description: "The question content ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findQuestionContentById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a question content" })
  @ApiParam({ name: "id", description: "The question content ID" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateQuestionContentDto,
  ) {
    return await this.ieltsTestsService.updateQuestionContent(id, updateDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a question content" })
  @ApiParam({ name: "id", description: "The question content ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteQuestionContent(id);
  }
}
