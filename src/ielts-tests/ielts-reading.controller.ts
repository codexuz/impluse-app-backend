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
} from "@nestjs/swagger";
import { IeltsTestsService } from "./ielts-tests.service.js";
import { CreateReadingDto } from "./dto/create-reading.dto.js";
import { UpdateReadingDto } from "./dto/update-reading.dto.js";
import { ReadingQueryDto } from "./dto/query.dto.js";
import {
  LinkReadingPartDto,
  UnlinkReadingPartDto,
} from "./dto/link-reading-part.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Reading")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-reading")
export class IeltsReadingController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) { }

  // ========== Reading ==========
  @Post()
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

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all reading sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all reading sections.",
  })
  async findAllReadings(@Query() query: ReadingQueryDto) {
    return await this.ieltsTestsService.findAllReadings(query);
  }

  // ========== Many-to-Many Link/Unlink ==========
  @Post("link-part")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Link an existing reading part to a reading (many-to-many)" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The reading part has been linked successfully.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "The reading part is already linked.",
  })
  async linkReadingPart(@Body() dto: LinkReadingPartDto) {
    return await this.ieltsTestsService.linkReadingPart(dto);
  }

  @Delete("unlink-part")
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Unlink a reading part from a reading" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The reading part has been unlinked successfully.",
  })
  async unlinkReadingPart(@Body() dto: UnlinkReadingPartDto) {
    return await this.ieltsTestsService.unlinkReadingPart(dto);
  }

  @Get(":id/linked-parts")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all linked reading parts (many-to-many)" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all linked reading parts.",
  })
  async getLinkedReadingParts(@Param("id") id: string) {
    return await this.ieltsTestsService.getLinkedReadingParts(id);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a reading section by ID" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested reading section.",
  })
  async findReadingById(@Param("id") id: string) {
    return await this.ieltsTestsService.findReadingById(id);
  }

  @Patch(":id")
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

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a reading section" })
  @ApiParam({ name: "id", description: "The reading ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReading(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteReading(id);
  }
}
