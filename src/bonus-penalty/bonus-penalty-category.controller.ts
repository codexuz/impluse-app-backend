import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { BonusPenaltyCategoryService } from "./bonus-penalty-category.service.js";
import { CreateBonusPenaltyCategoryDto } from "./dto/create-bonus-penalty-category.dto.js";
import { UpdateBonusPenaltyCategoryDto } from "./dto/update-bonus-penalty-category.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Bonus & Penalty Categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("bonus-penalty-categories")
export class BonusPenaltyCategoryController {
  constructor(
    private readonly bonusPenaltyCategoryService: BonusPenaltyCategoryService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Create a new bonus & penalty category" })
  create(
    @Body() createBonusPenaltyCategoryDto: CreateBonusPenaltyCategoryDto,
  ) {
    return this.bonusPenaltyCategoryService.create(
      createBonusPenaltyCategoryDto,
    );
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Get all bonus & penalty categories" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["bonus", "jarima", "referal"],
    description: "Filter categories by transaction type",
  })
  findAll(@Query("type") type?: string) {
    return this.bonusPenaltyCategoryService.findAll(type);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER, Role.TEACHER)
  @ApiOperation({ summary: "Get bonus & penalty category by ID" })
  @ApiParam({ name: "id", description: "Category ID (UUID)", type: "string" })
  findOne(@Param("id") id: string) {
    return this.bonusPenaltyCategoryService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Update bonus & penalty category" })
  @ApiParam({ name: "id", description: "Category ID (UUID)", type: "string" })
  update(
    @Param("id") id: string,
    @Body() updateBonusPenaltyCategoryDto: UpdateBonusPenaltyCategoryDto,
  ) {
    return this.bonusPenaltyCategoryService.update(
      id,
      updateBonusPenaltyCategoryDto,
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: "Delete bonus & penalty category (soft delete)" })
  @ApiParam({ name: "id", description: "Category ID (UUID)", type: "string" })
  remove(@Param("id") id: string) {
    return this.bonusPenaltyCategoryService.remove(id);
  }
}
