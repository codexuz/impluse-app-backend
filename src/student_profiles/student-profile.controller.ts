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
} from '@nestjs/common';
import { StudentProfileService } from './student-profile.service.js';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto.js';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Student Profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-profiles')
export class StudentProfileController {
  constructor(private readonly studentProfileService: StudentProfileService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new student profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @ApiBody({ type: CreateStudentProfileDto })
  create(@Body() createStudentProfileDto: CreateStudentProfileDto) {
    return this.studentProfileService.create(createStudentProfileDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all student profiles' })
  @ApiResponse({ status: 200, description: 'Return all student profiles' })
  findAll() {
    return this.studentProfileService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student profile by id' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 200, description: 'Return the student profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  findOne(@Param('id') id: string) {
    return this.studentProfileService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student profile by user id' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return the student profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  findByUserId(@Param('userId') userId: string) {
    return this.studentProfileService.findByUserId(userId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update student profile' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiBody({ type: UpdateStudentProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  update(
    @Param('id') id: string,
    @Body() updateStudentProfileDto: UpdateStudentProfileDto,
  ) {
    return this.studentProfileService.update(id, updateStudentProfileDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete student profile' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 204, description: 'Profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  remove(@Param('id') id: string) {
    return this.studentProfileService.remove(id);
  }

  @Patch(':id/points/add/:amount')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Add points to student profile' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiParam({ name: 'amount', description: 'Amount of points to add' })
  @ApiResponse({ status: 200, description: 'Points added successfully' })
  addPoints(@Param('id') id: string, @Param('amount') amount: number) {
    return this.studentProfileService.addPoints(id, amount);
  }

  @Patch(':id/coins/add/:amount')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Add coins to student profile' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiParam({ name: 'amount', description: 'Amount of coins to add' })
  @ApiResponse({ status: 200, description: 'Coins added successfully' })
  addCoins(@Param('id') id: string, @Param('amount') amount: number) {
    return this.studentProfileService.addCoins(id, amount);
  }

  @Patch(':id/streak/increment')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Increment student streak' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 200, description: 'Streak incremented successfully' })
  incrementStreak(@Param('id') id: string) {
    return this.studentProfileService.incrementStreak(id);
  }

  @Patch(':id/streak/reset')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Reset student streak' })
  @ApiParam({ name: 'id', description: 'Student Profile ID' })
  @ApiResponse({ status: 200, description: 'Streak reset successfully' })
  resetStreak(@Param('id') id: string) {
    return this.studentProfileService.resetStreak(id);
  }
}
