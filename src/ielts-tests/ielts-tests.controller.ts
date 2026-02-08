import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CreateTestDto } from "./dto/create-test.dto.js";
import { UpdateTestDto } from "./dto/update-test.dto.js";
import { CreateReadingDto } from "./dto/create-reading.dto.js";
import { UpdateReadingDto } from "./dto/update-reading.dto.js";
import { CreateReadingPartDto } from "./dto/create-reading-part.dto.js";
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
import { CreateWritingDto } from "./dto/create-writing.dto.js";
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { CreateAudioDto } from "./dto/create-audio.dto.js";
import { CreateQuestionDto } from "./dto/create-question.dto.js";
import { CreateQuestionContentDto } from "./dto/create-question-content.dto.js";
import { CreateQuestionOptionDto } from "./dto/create-question-option.dto.js";
import { CreateMultipleChoiceQuestionDto } from "./dto/create-multiple-choice-question.dto.js";
import { CreateMultipleChoiceOptionDto } from "./dto/create-multiple-choice-option.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
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
  async createTest(@Body() createTestDto: CreateTestDto) {
    return await this.ieltsTestsService.createTest(createTestDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all IELTS tests" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all tests.",
  })
  async findAllTests() {
    return await this.ieltsTestsService.findAllTests();
  }

  // ========== Reading ==========
  @Post("reading")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new reading section" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The reading section has been successfully created.",
  })
  async createReading(@Body() createReadingDto: CreateReadingDto) {
    return await this.ieltsTestsService.createReading(createReadingDto);
  }

  @Get("reading")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all reading sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all reading sections.",
  })
  async findAllReadings() {
    return await this.ieltsTestsService.findAllReadings();
  }

  @Get("reading/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a reading section by ID" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested reading section.",
  })
  async findReadingById(@Param("id") id: string) {
    return await this.ieltsTestsService.findReadingById(id);
  }

  @Patch("reading/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a reading section" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The reading section has been successfully updated.",
  })
  async updateReading(
    @Param("id") id: string,
    @Body() updateReadingDto: UpdateReadingDto,
  ) {
    return await this.ieltsTestsService.updateReading(id, updateReadingDto);
  }

  @Delete("reading/:id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a reading section" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReading(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteReading(id);
  }

  // ========== Reading Parts ==========
  @Post("reading-part")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new reading part" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The reading part has been successfully created.",
  })
  async createReadingPart(@Body() createReadingPartDto: CreateReadingPartDto) {
    return await this.ieltsTestsService.createReadingPart(createReadingPartDto);
  }

  @Get("reading-part/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a reading part by ID" })
  @ApiParam({ name: "id", description: "The reading part ID" })
  async findReadingPartById(@Param("id") id: string) {
    return await this.ieltsTestsService.findReadingPartById(id);
  }

  // ========== Listening ==========
  @Post("listening")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new listening section" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The listening section has been successfully created.",
  })
  async createListening(@Body() createListeningDto: CreateListeningDto) {
    return await this.ieltsTestsService.createListening(createListeningDto);
  }

  @Get("listening")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all listening sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all listening sections.",
  })
  async findAllListenings() {
    return await this.ieltsTestsService.findAllListenings();
  }

  @Get("listening/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a listening section by ID" })
  @ApiParam({ name: "id", description: "The listening ID" })
  async findListeningById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningById(id);
  }

  // ========== Listening Parts ==========
  @Post("listening-part")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new listening part" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The listening part has been successfully created.",
  })
  async createListeningPart(
    @Body() createListeningPartDto: CreateListeningPartDto,
  ) {
    return await this.ieltsTestsService.createListeningPart(
      createListeningPartDto,
    );
  }

  @Get("listening-part/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a listening part by ID" })
  @ApiParam({ name: "id", description: "The listening part ID" })
  async findListeningPartById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningPartById(id);
  }

  // ========== Writing ==========
  @Post("writing")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new writing section" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The writing section has been successfully created.",
  })
  async createWriting(@Body() createWritingDto: CreateWritingDto) {
    return await this.ieltsTestsService.createWriting(createWritingDto);
  }

  @Get("writing")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all writing sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all writing sections.",
  })
  async findAllWritings() {
    return await this.ieltsTestsService.findAllWritings();
  }

  @Get("writing/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a writing section by ID" })
  @ApiParam({ name: "id", description: "The writing ID" })
  async findWritingById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingById(id);
  }

  // ========== Writing Tasks ==========
  @Post("writing-task")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new writing task" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The writing task has been successfully created.",
  })
  async createWritingTask(@Body() createWritingTaskDto: CreateWritingTaskDto) {
    return await this.ieltsTestsService.createWritingTask(createWritingTaskDto);
  }

  @Get("writing-task/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a writing task by ID" })
  @ApiParam({ name: "id", description: "The writing task ID" })
  async findWritingTaskById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingTaskById(id);
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

  // ========== Question Contents ==========
  @Post("question-content")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create question content" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question content has been successfully created.",
  })
  async createQuestionContent(
    @Body() createQuestionContentDto: CreateQuestionContentDto,
  ) {
    return await this.ieltsTestsService.createQuestionContent(
      createQuestionContentDto,
    );
  }

  @Get("question-content/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get question content by ID" })
  @ApiParam({ name: "id", description: "The question content ID" })
  async findQuestionContentById(@Param("id") id: string) {
    return await this.ieltsTestsService.findQuestionContentById(id);
  }

  // ========== Question Options ==========
  @Post("question-option")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a question option" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The question option has been successfully created.",
  })
  async createQuestionOption(
    @Body() createQuestionOptionDto: CreateQuestionOptionDto,
  ) {
    return await this.ieltsTestsService.createQuestionOption(
      createQuestionOptionDto,
    );
  }

  // ========== Multiple Choice Questions ==========
  @Post("multiple-choice-question")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a multiple choice question" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The multiple choice question has been successfully created.",
  })
  async createMultipleChoiceQuestion(
    @Body() createMultipleChoiceQuestionDto: CreateMultipleChoiceQuestionDto,
  ) {
    return await this.ieltsTestsService.createMultipleChoiceQuestion(
      createMultipleChoiceQuestionDto,
    );
  }

  @Get("multiple-choice-question/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a multiple choice question by ID" })
  @ApiParam({ name: "id", description: "The multiple choice question ID" })
  async findMultipleChoiceQuestionById(@Param("id") id: string) {
    return await this.ieltsTestsService.findMultipleChoiceQuestionById(id);
  }

  // ========== Multiple Choice Options ==========
  @Post("multiple-choice-option")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a multiple choice option" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The multiple choice option has been successfully created.",
  })
  async createMultipleChoiceOption(
    @Body() createMultipleChoiceOptionDto: CreateMultipleChoiceOptionDto,
  ) {
    return await this.ieltsTestsService.createMultipleChoiceOption(
      createMultipleChoiceOptionDto,
    );
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
