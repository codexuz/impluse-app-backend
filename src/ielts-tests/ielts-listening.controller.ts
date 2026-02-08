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
import { CreateListeningDto } from "./dto/create-listening.dto.js";
import { CreateListeningPartDto } from "./dto/create-listening-part.dto.js";
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

  // ========== Listening Parts ==========
  @Post("part")
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

  @Get("part/:id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get a listening part by ID" })
  @ApiParam({ name: "id", description: "The listening part ID" })
  async findListeningPartById(@Param("id") id: string) {
    return await this.ieltsTestsService.findListeningPartById(id);
  }
}
