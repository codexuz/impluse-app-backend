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
} from "@nestjs/common";
import { BranchesService } from "./branches.service.js";
import { CreateBranchDto } from "./dto/create-branch.dto.js";
import { UpdateBranchDto } from "./dto/update-branch.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("branches")
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  async findAll() {
    return await this.branchesService.findAll();
  }

  @Get("owner/:ownerId")
  @Roles(Role.ADMIN, Role.TEACHER)
  async findByOwner(@Param("ownerId") ownerId: string) {
    return await this.branchesService.findByOwner(ownerId);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  async findOne(@Param("id") id: string) {
    return await this.branchesService.findOne(id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  async update(
    @Param("id") id: string,
    @Body() updateBranchDto: UpdateBranchDto
  ) {
    return await this.branchesService.update(id, updateBranchDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string) {
    return await this.branchesService.remove(id);
  }

  @Delete(":id/hard")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async hardRemove(@Param("id") id: string) {
    return await this.branchesService.hardRemove(id);
  }
}
