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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { ArticlesService } from "./articles.service.js";
import { CreateArticleDto } from "./dto/create-article.dto.js";
import { UpdateArticleDto } from "./dto/update-article.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { Role } from "../roles/role.enum.js";

@ApiTags("Articles")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Create a new article" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The article has been successfully created.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data.",
  })
  async create(@Body() createArticleDto: CreateArticleDto) {
    return await this.articlesService.create(createArticleDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get all articles" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return all articles",
  })
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get("category/:category")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get articles by category" })
  @ApiParam({ name: "category", description: "The category name" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return articles in the specified category",
  })
  async findByCategory(@Param("category") category: string) {
    return await this.articlesService.findByCategory(category);
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Get an article by ID" })
  @ApiParam({ name: "id", description: "The article ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Return the requested article",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Article not found",
  })
  async findOne(@Param("id") id: string) {
    return await this.articlesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: "Update an article" })
  @ApiParam({ name: "id", description: "The article ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The article has been successfully updated.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Article not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return await this.articlesService.update(id, updateArticleDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an article" })
  @ApiParam({ name: "id", description: "The article ID" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Article not found",
  })
  async remove(@Param("id") id: string) {
    return await this.articlesService.remove(id);
  }

  @Post(":id/view")
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: "Increment article view count" })
  @ApiParam({ name: "id", description: "The article ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "View count incremented successfully",
  })
  async incrementSeenCount(@Param("id") id: string) {
    return await this.articlesService.incrementSeenCount(id);
  }
}
