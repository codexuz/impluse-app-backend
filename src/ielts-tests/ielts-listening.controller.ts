import {
  Controller,
  Get,
  Post,
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
import { ListeningQueryDto } from "./dto/query.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("IELTS Listening")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("ielts-listening")
export class IeltsListeningController {
  constructor(private readonly ieltsTestsService: IeltsTestsService) {}

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
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all listening sections" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all listening sections.",
  })
  async findAllListenings(@Query() query: ListeningQueryDto) {
    return await this.ieltsTestsService.findAllListenings(query);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a listening section by ID" })
  @ApiParam({ name: "id", description: "The listening ID" })
  async findListeningById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningById(id);
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
