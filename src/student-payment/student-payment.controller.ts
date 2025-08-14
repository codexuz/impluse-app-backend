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
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentPaymentService } from './student-payment.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CreateStudentPaymentDto, PaymentStatus } from './dto/create-student-payment.dto.js';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto.js';
import { StudentPaymentStatusDto } from './dto/student-payment-status.dto.js';
import { DuePaymentsResponseDto } from './dto/due-payments.dto.js';

@ApiTags('Student Payments')
@Controller('student-payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentPaymentController {
  constructor(private readonly studentPaymentService: StudentPaymentService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new student payment' })
  @ApiResponse({ status: 201, description: 'Payment successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createStudentPaymentDto: CreateStudentPaymentDto) {
    return this.studentPaymentService.create(createStudentPaymentDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all student payments' })
  @ApiResponse({ status: 200, description: 'List of all payments.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.studentPaymentService.findAll();
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get all payments for a specific student' })
  @ApiResponse({ status: 200, description: 'List of student\'s payments.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.studentPaymentService.findByStudent(studentId);
  }
  
  @Get('student/:studentId/status')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({ summary: 'Get payment status summary for a student' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment status summary including totals and upcoming payment details.',
    type: StudentPaymentStatusDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'No payment records found for student.' })
  async getStudentPaymentStatus(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.studentPaymentService.calculateStudentPaymentStatus(studentId);
  }
  


  @Get('upcoming')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get upcoming payments within specified days' })
  @ApiResponse({ status: 200, description: 'List of upcoming payments.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findUpcomingPayments(@Query('days') days: number) {
    return this.studentPaymentService.findUpcomingPayments(days);
  }

  @Get('status/:status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get payments by status' })
  @ApiResponse({ status: 200, description: 'List of payments with specified status.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findByStatus(@Param('status') status: string) {
    return this.studentPaymentService.findByStatus(status as PaymentStatus);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a specific payment' })
  @ApiResponse({ status: 200, description: 'Payment details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentPaymentService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a payment' })
  @ApiResponse({ status: 200, description: 'Payment successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentPaymentDto: UpdateStudentPaymentDto
  ) {
    return this.studentPaymentService.update(id, updateStudentPaymentDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: 'pending' | 'completed' | 'failed'
  ) {
    return this.studentPaymentService.updateStatus(id, status as PaymentStatus);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a payment' })
  @ApiResponse({ status: 204, description: 'Payment successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Payment not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentPaymentService.remove(id);
  }

  @Post('trigger-payment-creation')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Manually trigger the automatic payment creation (admin only)' })
  @ApiResponse({ status: 200, description: 'Payment creation job triggered successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async triggerPaymentCreation() {
    await this.studentPaymentService.handleAutomaticPaymentCreation();
    return { message: 'Payment creation job triggered successfully' };
  }
  
  @Get('check-due-payments')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Check which payments would be processed by the automatic payment job' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of payments that would be processed',
    type: DuePaymentsResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async checkDuePayments(): Promise<DuePaymentsResponseDto> {
    return this.studentPaymentService.checkDuePayments();
  }
}