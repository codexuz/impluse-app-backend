import {
  Controller,
  Get,
  Post,
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
import { CreateWritingTaskDto } from "./dto/create-writing-task.dto.js";
import { WritingQueryDto } from "./dto/query.dto.js";
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
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all writing sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all writing sections.",
  })
  async findAllWritings(@Query() query: WritingQueryDto) {
    return await this.ieltsTestsService.findAllWritings(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a writing section by ID" })
  @ApiParam({ name: "id", description: "The writing ID" })
  async findWritingById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingById(id);
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

  @Get("task/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a writing task by ID" })
  @ApiParam({ name: "id", description: "The writing task ID" })
  async findWritingTaskById(@Param("id") id: string) {
    return await this.ieltsTestsService.findWritingTaskById(id);
  }
}
