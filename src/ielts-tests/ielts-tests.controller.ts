import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  ApiQuery,
} from "@nestjs/swagger";
import { IeltsTestsService } from "./ielts-tests.service.js";
import { CreateTestDto } from "./dto/create-test.dto.js";
import { UpdateTestDto } from "./dto/update-test.dto.js";
import { TestQueryDto } from "./dto/query.dto.js";
import { CreateAudioDto } from "./dto/create-audio.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { CreateSubQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Tests")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-tests")
export class IeltsTestsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  // ========== Tests ==========
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new IELTS test" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The test has been successfully created.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data.",
  })
  async createTest(
    @Body() createTestDto: CreateTestDto,
    @CurrentUser() user: any,
  ) {
    return await this.ieltsTestsService.createTest({
      ...createTestDto,
      created_by: user.userId,
    });
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all IELTS tests" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all tests.",
  })
  async findAllTests(@Query() query: TestQueryDto) {
    return await this.ieltsTestsService.findAllTests(query);
  }

  // ========== Audio ==========
  @Post("audio")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new audio file" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The audio has been successfully created.",
  })
  async createAudio(@Body() createAudioDto: CreateAudioDto) {
    return await this.ieltsTestsService.createAudio(createAudioDto);
  }

  @Get("audio")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all audio files" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all audio files.",
  })
  async findAllAudios() {
    return await this.ieltsTestsService.findAllAudios();
  }

  @Get("audio/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an audio file by ID" })
  @ApiParam({ name: "id", description: "The audio ID" })
  async findAudioById(@Param("id") id: string) {
    return await this.ieltsTestsService.findAudioById(id);
  }

  // ========== Questions ==========
  @Post("question")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question has been successfully created.",
  })
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.ieltsTestsService.createQuestion(createQuestionDto);
  }

  @Get("question/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a question by ID" })
  @ApiParam({ name: "id", description: "The question ID" })
  async findQuestionById(@Param("id") id: string) {
    return await this.ieltsTestsService.findQuestionById(id);
  }

  // ========== Sub Questions ==========
  @Post("sub-question")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a sub question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The sub question has been successfully created.",
  })
  async createSubQuestion(@Body() createSubQuestionDto: CreateSubQuestionDto) {
    return await this.ieltsTestsService.createSubQuestion(createSubQuestionDto);
  }

  @Get("sub-question/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a sub question by ID" })
  @ApiParam({ name: "id", description: "The sub question ID" })
  async findSubQuestionById(@Param("id") id: string) {
    return await this.ieltsTestsService.findSubQuestionById(id);
  }

  // ========== Test by ID (must be LAST to avoid catching named routes) ==========
  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an IELTS test by ID" })
  @ApiParam({ name: "id", description: "The test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested test.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Test not found.",
  })
  async findTestById(@Param("id") id: string) {
    return await this.ieltsTestsService.findTestById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update an IELTS test" })
  @ApiParam({ name: "id", description: "The test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The test has been successfully updated.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Test not found.",
  })
  async updateTest(
    @Param("id") id: string,
    @Body() updateTestDto: UpdateTestDto,
  ) {
    return await this.ieltsTestsService.updateTest(id, updateTestDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete an IELTS test" })
  @ApiParam({ name: "id", description: "The test ID" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The test has been successfully deleted.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Test not found.",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTest(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteTest(id);
  }
}
