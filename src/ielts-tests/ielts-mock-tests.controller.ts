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
import { IeltsMockTestsService } from "./ielts-mock-tests.service.js";
import { CreateMockTestDto } from "./dto/create-mock-test.dto.js";
import { UpdateMockTestDto } from "./dto/update-mock-test.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Mock Tests")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-mock-tests")
export class IeltsMockTestsController {
  constructor(private readonly ieltsMockTestsService: IeltsMockTestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Assign a mock test to a student" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The mock test has been successfully assigned.",
  })
  async create(@Body() dto: CreateMockTestDto) {
    return await this.ieltsMockTestsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all mock tests with filters" })
  @ApiQuery({ name: "user_id", required: false })
  @ApiQuery({ name: "test_id", required: false })
  @ApiQuery({ name: "group_id", required: false })
  @ApiQuery({ name: "teacher_id", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all mock tests.",
  })
  async findAll(
    @Query("user_id") user_id?: string,
    @Query("test_id") test_id?: string,
    @Query("group_id") group_id?: string,
    @Query("teacher_id") teacher_id?: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return await this.ieltsMockTestsService.findAll({
      user_id,
      test_id,
      group_id,
      teacher_id,
      page,
      limit,
    });
  }

  @Get("my")
  @Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: "Get mock tests assigned to current user" })
  async findMy(@CurrentUser() user: any) {
    return await this.ieltsMockTestsService.findByUser(user.userId);
  }

  @Get("group/:groupId")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Get mock tests by group" })
  @ApiParam({ name: "groupId", description: "Group ID" })
  async findByGroup(@Param("groupId") groupId: string) {
    return await this.ieltsMockTestsService.findByGroup(groupId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a mock test by ID" })
  @ApiParam({ name: "id", description: "Mock test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the mock test.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Mock test not found.",
  })
  async findOne(@Param("id") id: string) {
    return await this.ieltsMockTestsService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a mock test" })
  @ApiParam({ name: "id", description: "Mock test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The mock test has been successfully updated.",
  })
  async update(@Param("id") id: string, @Body() dto: UpdateMockTestDto) {
    return await this.ieltsMockTestsService.update(id, dto);
  }

  @Patch(":id/archive")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Archive a mock test" })
  @ApiParam({ name: "id", description: "Mock test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The mock test has been archived.",
  })
  async archive(@Param("id") id: string) {
    return await this.ieltsMockTestsService.archive(id);
  }

  @Patch(":id/unarchive")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Unarchive a mock test" })
  @ApiParam({ name: "id", description: "Mock test ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The mock test has been unarchived.",
  })
  async unarchive(@Param("id") id: string) {
    return await this.ieltsMockTestsService.unarchive(id);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a mock test" })
  @ApiParam({ name: "id", description: "Mock test ID" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The mock test has been successfully deleted.",
  })
  async remove(@Param("id") id: string) {
    return await this.ieltsMockTestsService.remove(id);
  }
}
