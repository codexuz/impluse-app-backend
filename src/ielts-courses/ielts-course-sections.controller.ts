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
import { IeltsCoursesService } from "./ielts-courses.service.js";
import { CreateCourseSectionDto } from "./dto/create-course-section.dto.js";
import { UpdateCourseSectionDto } from "./dto/update-course-section.dto.js";
import { SectionQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Course Sections")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-course-sections")
export class IeltsCourseSectionsController {
  constructor(private readonly ieltsCoursesService: IeltsCoursesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new course section" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Section created.",
  })
  async create(@Body() dto: CreateCourseSectionDto) {
    return await this.ieltsCoursesService.createSection(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all course sections" })
  async findAll(@Query() query: SectionQueryDto) {
    return await this.ieltsCoursesService.findAllSections(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a section by ID" })
  @ApiParam({ name: "id", description: "Section ID" })
  async findOne(@Param("id") id: string) {
    return await this.ieltsCoursesService.findSectionById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a section" })
  @ApiParam({ name: "id", description: "Section ID" })
  async update(@Param("id") id: string, @Body() dto: UpdateCourseSectionDto) {
    return await this.ieltsCoursesService.updateSection(id, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a section" })
  @ApiParam({ name: "id", description: "Section ID" })
  async remove(@Param("id") id: string) {
    return await this.ieltsCoursesService.deleteSection(id);
  }
}
