import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service.js';
import { CreateAttendanceDto } from './dto/create-attendance.dto.js';
import { UpdateAttendanceDto } from './dto/update-attendance.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new attendance record' })
  @ApiResponse({ status: 201, description: 'Attendance record created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions.' })
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return await this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @Roles(Role.ADMIN )
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({ status: 200, description: 'Returns all attendance records.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  async findAll() {
    return await this.attendanceService.findAll();
  }

  @Get('group/:groupId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance records by group ID' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance records for the specified group.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async findByGroup(@Param('groupId') groupId: string) {
    return await this.attendanceService.findByGroupId(groupId);
  }

  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance records by teacher ID' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance records for the specified teacher.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  async findByTeacher(@Param('teacherId') teacherId: string) {
    return await this.attendanceService.findByTeacherId(teacherId);
  }

  @Get('daterange')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance records by date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance records within the specified date range.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid date format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.attendanceService.findByDateRange(startDate, endDate);
  }

  @Get('group/:groupId/daterange')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance records by group ID and date range' })
  @ApiParam({ name: 'groupId', description: 'Group ID', type: 'string' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns attendance records for the specified group within the date range.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid date format or group ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async findByGroupAndDateRange(
    @Param('groupId') groupId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.attendanceService.findByGroupAndDateRange(groupId, startDate, endDate);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns the attendance record.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async findOne(@Param('id') id: string) {
    return await this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Attendance record updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return await this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Attendance record deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  async remove(@Param('id') id: string) {
    return await this.attendanceService.remove(id);
  }
}
