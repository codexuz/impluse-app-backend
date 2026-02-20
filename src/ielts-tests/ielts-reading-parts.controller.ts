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
  ApiQuery,
} from "@nestjs/swagger";
import { IeltsTestsService } from "./ielts-tests.service.js";
import { CreateReadingPartDto } from "./dto/create-reading-part.dto.js";
import { UpdateReadingPartDto } from "./dto/update-reading-part.dto.js";
import { ReadingPartQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Reading Parts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-reading-parts")
export class IeltsReadingPartsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
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

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all reading parts" })
  async findAllReadingParts(@Query() query: ReadingPartQueryDto) {
    return await this.ieltsTestsService.findAllReadingParts(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a reading part by ID" })
  @ApiParam({ name: "id", description: "The reading part ID" })
  async findReadingPartById(@Param("id") id: string) {
    return await this.ieltsTestsService.findReadingPartById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a reading part" })
  @ApiParam({ name: "id", description: "The reading part ID" })
  async updateReadingPart(
    @Param("id") id: string,
    @Body() updateReadingPartDto: UpdateReadingPartDto,
  ) {
    return await this.ieltsTestsService.updateReadingPart(
      id,
      updateReadingPartDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a reading part" })
  @ApiParam({ name: "id", description: "The reading part ID" })
  async deleteReadingPart(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteReadingPart(id);
  }
}
