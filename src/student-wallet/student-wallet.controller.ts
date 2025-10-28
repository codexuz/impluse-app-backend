import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { StudentWalletService } from './student-wallet.service.js';
import { CreateStudentWalletDto } from './dto/create-student-wallet.dto.js';
import { UpdateStudentWalletDto } from './dto/update-student-wallet.dto.js';
import { UpdateWalletAmountDto } from './dto/update-wallet-amount.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Student Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-wallet')
export class StudentWalletController {
  constructor(private readonly studentWalletService: StudentWalletService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Create a new student wallet' })
  create(@Body() createStudentWalletDto: CreateStudentWalletDto) {
    return this.studentWalletService.create(createStudentWalletDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all student wallets' })
  findAll() {
    return this.studentWalletService.findAll();
  }

  @Get('student/:studentId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get wallet by student ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID (UUID)', type: 'string' })
  findByStudentId(@Param('studentId') studentId: string) {
    return this.studentWalletService.findByStudentId(studentId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get student wallet by ID' })
  @ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.studentWalletService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Update student wallet' })
  @ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateStudentWalletDto: UpdateStudentWalletDto) {
    return this.studentWalletService.update(id, updateStudentWalletDto);
  }

  @Patch(':id/amount')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Add or deduct amount from student wallet' })
  @ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' })
  updateAmount(@Param('id') id: string, @Body() updateWalletAmountDto: UpdateWalletAmountDto) {
    return this.studentWalletService.updateAmount(id, updateWalletAmountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete student wallet (soft delete)' })
  @ApiParam({ name: 'id', description: 'Wallet ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.studentWalletService.remove(id);
  }
}
