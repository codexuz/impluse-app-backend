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
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
import { UpdateListeningPartDto } from "./dto/update-listening-part.dto.js";
import { ListeningPartQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Listening Parts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-listening-parts")
export class IeltsListeningPartsController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

  @Post()
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

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get all listening parts" })
  async findAllListeningParts(@Query() query: ListeningPartQueryDto) {
    return await this.ieltsTestsService.findAllListeningParts(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.GUEST)
  @ApiOperation({ summary: "Get a listening part by ID" })
  @ApiParam({ name: "id", description: "The listening part ID" })
  async findListeningPartById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningPartById(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update a listening part" })
  @ApiParam({ name: "id", description: "The listening part ID" })
  async updateListeningPart(
    @Param("id") id: string,
    @Body() updateListeningPartDto: UpdateListeningPartDto,
  ) {
    return await this.ieltsTestsService.updateListeningPart(
      id,
      updateListeningPartDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Delete a listening part" })
  @ApiParam({ name: "id", description: "The listening part ID" })
  async deleteListeningPart(@Param("id") id: string) {
    return await this.ieltsTestsService.deleteListeningPart(id);
  }
}
