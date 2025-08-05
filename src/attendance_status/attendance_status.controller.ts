import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AttendanceStatusService } from './attendance_status.service.js';
import { CreateAttendanceStatusDto } from './dto/create-attendance-status.dto.js';
import { UpdateAttendanceStatusDto } from './dto/update-attendance-status.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Attendance Status')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance-status')
export class AttendanceStatusController {
  constructor(private readonly attendanceStatusService: AttendanceStatusService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new attendance status record' })
  @ApiResponse({ status: 201, description: 'Attendance status record created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  async create(@Body() createAttendanceStatusDto: CreateAttendanceStatusDto) {
    return await this.attendanceStatusService.create(createAttendanceStatusDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create multiple attendance status records in bulk' })
  @ApiResponse({ status: 201, description: 'Attendance status records created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  async bulkCreate(@Body() createAttendanceStatusDtos: CreateAttendanceStatusDto[]) {
    return await this.attendanceStatusService.bulkCreate(createAttendanceStatusDtos);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all attendance status records' })
  @ApiResponse({ status: 200, description: 'Returns all attendance status records.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  async findAll() {
    return await this.attendanceStatusService.findAll();
  }

  @Get('attendance/:attendanceId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance status records by attendance ID' })
  @ApiParam({ name: 'attendanceId', description: 'Attendance ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance status records for the specified attendance.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Attendance not found.' })
  async findByAttendance(@Param('attendanceId') attendanceId: string) {
    return await this.attendanceStatusService.findByAttendanceId(attendanceId);
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get attendance status records by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance status records for the specified student.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async findByStudent(@Param('studentId') studentId: string) {
    return await this.attendanceStatusService.findByStudentId(studentId);
  }

  @Get('student/:studentId/stats')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student attendance statistics' })
  @ApiParam({ name: 'studentId', description: 'Student ID', type: 'string' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance statistics for the student.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid date format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async getStudentStats(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.attendanceStatusService.getStudentAttendanceStats(
      studentId,
      startDate,
      endDate,
    );
  }

  @Get('student/:studentId/daterange')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student attendance status records by date range' })
  @ApiParam({ name: 'studentId', description: 'Student ID', type: 'string' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance status records for the student within the date range.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid date format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async findByStudentAndDateRange(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.attendanceStatusService.findByStudentAndDateRange(
      studentId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get attendance status record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance status record ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns the attendance status record.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Attendance status record not found.' })
  async findOne(@Param('id') id: string) {
    return await this.attendanceStatusService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update attendance status record' })
  @ApiParam({ name: 'id', description: 'Attendance status record ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Attendance status record updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Attendance status record not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceStatusDto: UpdateAttendanceStatusDto,
  ) {
    return await this.attendanceStatusService.update(id, updateAttendanceStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete attendance status record' })
  @ApiParam({ name: 'id', description: 'Attendance status record ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Attendance status record deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Attendance status record not found.' })
  async remove(@Param('id') id: string) {
    return await this.attendanceStatusService.remove(id);
  }
}
