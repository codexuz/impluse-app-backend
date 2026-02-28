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
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { UpdateListeningDto } from "./dto/update-listening.dto.js";
import { ListeningQueryDto } from "./dto/query.dto.js";
import {
  LinkListeningPartDto,
  UnlinkListeningPartDto,
} from "./dto/link-listening-part.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Listening")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-listening")
export class IeltsListeningController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) { }

  // ========== Listening ==========
  @Post()
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

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all listening sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all listening sections.",
  })
  async findAllListenings(@Query() query: ListeningQueryDto) {
    return await this.ieltsTestsService.findAllListenings(query);
  }

  // ========== Many-to-Many Link/Unlink ==========
  @Post("link-part")
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Link an existing listening part to a listening (many-to-many)" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The listening part has been linked successfully.",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "The listening part is already linked.",
  })
  async linkListeningPart(@Body() dto: LinkListeningPartDto) {
    return await this.ieltsTestsService.linkListeningPart(dto);
  }

  @Delete("unlink-part")
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Unlink a listening part from a listening" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The listening part has been unlinked successfully.",
  })
  async unlinkListeningPart(@Body() dto: UnlinkListeningPartDto) {
    return await this.ieltsTestsService.unlinkListeningPart(dto);
  }

  @Get(":id/linked-parts")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all linked listening parts (many-to-many)" })
  @ApiParam({ name: "id", description: "The listening ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all linked listening parts.",
  })
  async getLinkedListeningParts(@Param("id") id: string) {
    return await this.ieltsTestsService.getLinkedListeningParts(id);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a listening section by ID" })
  @ApiParam({ name: "id", description: "The listening ID" })
  async findListeningById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a listening section" })
  @ApiParam({ name: "id", description: "The listening ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The listening section has been successfully updated.",
  })
  async updateListening(
    @Param("id") id: string,
    @Body() updateListeningDto: UpdateListeningDto,
  ) {
    return await this.ieltsTestsService.updateListening(id, updateListeningDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a listening section" })
  @ApiParam({ name: "id", description: "The listening ID" })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListening(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteListening(id);
  }
}
