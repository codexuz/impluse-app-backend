import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { CreateMovieDto, MovieGenre, MovieType, MovieLevel } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  async create(@Body() createMovieDto: CreateMovieDto) {
    return await this.moviesService.create(createMovieDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async findAll(
    @Query('genre') genre?: MovieGenre,
    @Query('type') type?: MovieType,
    @Query('level') level?: MovieLevel,
  ) {
    return await this.moviesService.findAll({ genre, type, level });
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async search(@Query('term') searchTerm: string) {
    return await this.moviesService.search(searchTerm);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async findOne(@Param('id') id: string) {
    return await this.moviesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  async update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return await this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.TEACHER)
  async remove(@Param('id') id: string) {
    return await this.moviesService.remove(id);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  async restore(@Param('id') id: string) {
    return await this.moviesService.restore(id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  async hardRemove(@Param('id') id: string) {
    return await this.moviesService.hardRemove(id);
  }

  @Patch(':id/view')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  async incrementViewCount(@Param('id') id: string) {
    return await this.moviesService.incrementViewCount(id);
  }
}
