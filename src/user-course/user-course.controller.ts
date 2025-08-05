import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UserCourseService } from './user-course.service.js';
import { CreateUserCourseDto } from './dto/create-user-course.dto.js';
import { UpdateUserCourseDto } from './dto/update-user-course.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-courses')
export class UserCourseController {
  constructor(private readonly userCourseService: UserCourseService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Assign a user to a course' })
  create(@Body() createUserCourseDto: CreateUserCourseDto) {
    return this.userCourseService.create(createUserCourseDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all user-course assignments, can filter by userId or courseId' })
  findAll(
    @Query('userId') userId?: string,
    @Query('courseId') courseId?: string,
  ) {
    if (userId) {
      return this.userCourseService.findAllByUserId(userId);
    }
    if (courseId) {
      return this.userCourseService.findAllByCourseId(courseId);
    }
    return this.userCourseService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get user-course assignment by id' })
  findOne(@Param('id') id: string) {
    return this.userCourseService.findOne(id);
  }

  @Get('user/:userId/course/:courseId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get user-course assignment by user and course ids' })
  findByUserAndCourse(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.userCourseService.findByUserAndCourse(userId, courseId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update user-course assignment' })
  update(@Param('id') id: string, @Body() updateUserCourseDto: UpdateUserCourseDto) {
    return this.userCourseService.update(id, updateUserCourseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user-course assignment' })
  remove(@Param('id') id: string) {
    return this.userCourseService.remove(id);
  }
}

