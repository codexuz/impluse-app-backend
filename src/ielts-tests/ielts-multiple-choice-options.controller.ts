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
import { CreateMultipleChoiceOptionDto } from "./dto/create-multiple-choice-option.dto.js";
import { UpdateMultipleChoiceOptionDto } from "./dto/update-multiple-choice-option.dto.js";
import { MultipleChoiceOptionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Multiple Choice Options")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-multiple-choice-options")
export class IeltsMultipleChoiceOptionsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new multiple choice option" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The multiple choice option has been successfully created.",
  })
  async create(@Body() createDto: CreateMultipleChoiceOptionDto) {
    return await this.ieltsTestsService.createMultipleChoiceOption(createDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all multiple choice options" })
  async findAll(@Query() query: MultipleChoiceOptionQueryDto) {
    return await this.ieltsTestsService.findAllMultipleChoiceOptions(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a multiple choice option by ID" })
  @ApiParam({ name: "id", description: "The multiple choice option ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsTestsService.findMultipleChoiceOptionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a multiple choice option" })
  @ApiParam({ name: "id", description: "The multiple choice option ID" })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateMultipleChoiceOptionDto,
  ) {
    return await this.ieltsTestsService.updateMultipleChoiceOption(
      id,
      updateDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a multiple choice option" })
  @ApiParam({ name: "id", description: "The multiple choice option ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteMultipleChoiceOption(id);
  }
}
