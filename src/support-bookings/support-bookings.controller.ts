import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { SupportBookingsService } from './support-bookings.service.js';
import { 
  CreateSupportBookingDto, 
  UpdateSupportBookingDto, 
  SupportBookingResponseDto,
  BookingStatus 
} from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';

@ApiTags('Support Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('support-bookings')
export class SupportBookingsController {
  constructor(private readonly supportBookingsService: SupportBookingsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Create a new support booking' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Support booking has been successfully created.',
    type: SupportBookingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async create(@Body() createSupportBookingDto: CreateSupportBookingDto) {
    return this.supportBookingsService.create(createSupportBookingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get all support bookings' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all support bookings.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findAll() {
    return this.supportBookingsService.findAll();
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get support bookings by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support bookings for the specified student.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.supportBookingsService.findByStudent(studentId);
  }

  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support bookings by teacher ID' })
  @ApiParam({ name: 'teacherId', description: 'Teacher ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support bookings for the specified teacher.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByTeacher(@Param('teacherId') teacherId: string) {
    return this.supportBookingsService.findByTeacher(teacherId);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support bookings by status' })
  @ApiParam({ name: 'status', enum: BookingStatus, description: 'Booking status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support bookings with the specified status.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByStatus(@Param('status') status: BookingStatus) {
    return this.supportBookingsService.findByStatus(status);
  }

  @Get('schedule/:scheduleId')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support bookings by schedule ID' })
  @ApiParam({ name: 'scheduleId', description: 'Schedule ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support bookings for the specified schedule.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.supportBookingsService.findBySchedule(scheduleId);
  }

  @Get('date-range')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER)
  @ApiOperation({ summary: 'Get support bookings within a date range' })
  @ApiQuery({ name: 'startDate', description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of support bookings within the specified date range.',
    type: [SupportBookingResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid date format.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.supportBookingsService.findByDateRange(start, end);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Get support booking statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support booking statistics.',
    schema: {
      type: 'object',
      properties: {
        totalBookings: { type: 'number' },
        pendingBookings: { type: 'number' },
        approvedBookings: { type: 'number' },
        cancelledBookings: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async getStats() {
    return this.supportBookingsService.getBookingStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a support booking by ID' })
  @ApiParam({ name: 'id', description: 'Support booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support booking details.',
    type: SupportBookingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async findOne(@Param('id') id: string) {
    return this.supportBookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Update a support booking' })
  @ApiParam({ name: 'id', description: 'Support booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Support booking has been successfully updated.',
    type: SupportBookingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async update(@Param('id') id: string, @Body() updateSupportBookingDto: UpdateSupportBookingDto) {
    return this.supportBookingsService.update(id, updateSupportBookingDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Update support booking status' })
  @ApiParam({ name: 'id', description: 'Support booking ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Booking status has been successfully updated.',
    type: SupportBookingResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: BookingStatus
  ) {
    return this.supportBookingsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPPORT_TEACHER)
  @ApiOperation({ summary: 'Delete a support booking' })
  @ApiParam({ name: 'id', description: 'Support booking ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Support booking has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Support booking not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions.',
  })
  async remove(@Param('id') id: string) {
    return this.supportBookingsService.remove(id);
  }
}
