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
import { CreateWritingDto } from "./dto/create-writing.dto.js";
import { UpdateWritingDto } from "./dto/update-writing.dto.js";
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { UpdateWritingTaskDto } from "./dto/update-writing-task.dto.js";
import { WritingQueryDto, WritingTaskQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Writing")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-writing")
export class IeltsWritingController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  // ========== Writing ==========
  @Post()
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

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all writing sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all writing sections.",
  })
  async findAllWritings(@Query() query: WritingQueryDto) {
    return await this.ieltsTestsService.findAllWritings(query);
  }

  // ========== Writing Tasks ==========
  @Post("task")
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

  @Get("tasks")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all writing tasks" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all writing tasks.",
  })
  async findAllWritingTasks(@Query() query: WritingTaskQueryDto) {
    return await this.ieltsTestsService.findAllWritingTasks(query);
  }

  @Get("task/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a writing task by ID" })
  @ApiParam({ name: "id", description: "The writing task ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested writing task.",
  })
  async findWritingTaskById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingTaskById(id);
  }

  @Patch("task/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a writing task" })
  @ApiParam({ name: "id", description: "The writing task ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The writing task has been successfully updated.",
  })
  async updateWritingTask(
    @Param("id") id: string,
    @Body() updateWritingTaskDto: UpdateWritingTaskDto,
  ) {
    return await this.ieltsTestsService.updateWritingTask(
      id,
      updateWritingTaskDto,
    );
  }

  @Delete("task/:id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a writing task" })
  @ApiParam({ name: "id", description: "The writing task ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWritingTask(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteWritingTask(id);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a writing section by ID" })
  @ApiParam({ name: "id", description: "The writing ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested writing section.",
  })
  async findWritingById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a writing section" })
  @ApiParam({ name: "id", description: "The writing ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The writing section has been successfully updated.",
  })
  async updateWriting(
    @Param("id") id: string,
    @Body() updateWritingDto: UpdateWritingDto,
  ) {
    return await this.ieltsTestsService.updateWriting(id, updateWritingDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a writing section" })
  @ApiParam({ name: "id", description: "The writing ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWriting(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteWriting(id);
  }
}
