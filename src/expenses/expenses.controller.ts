import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  // ============= EXPENSES ENDPOINTS =============

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new expense' })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all expenses' })
  @ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID' })
  @ApiQuery({ name: 'teacher_id', required: false, description: 'Filter by teacher ID' })
  @ApiQuery({ name: 'reported_by', required: false, description: 'Filter by reporter user ID' })
  findAll(
    @Query('category_id') categoryId?: string,
    @Query('teacher_id') teacherId?: string,
    @Query('reported_by') reportedBy?: string
  ) {
    return this.expensesService.findAll(categoryId, teacherId, reportedBy);
  }


  @Get('reports/date-range')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get expenses by date range' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'end_date', required: false, description: 'End date (YYYY-MM-DD)', type: 'string' })
  findByDateRange(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ) {
    if (!startDate || !endDate) {
      return [];
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.expensesService.findByDateRange(start, end);
  }

  @Get('reports/monthly/:year/:month')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get expenses by month' })
  @ApiParam({ name: 'year', description: 'Year (YYYY)', type: 'number' })
  @ApiParam({ name: 'month', description: 'Month (1-12)', type: 'number' })
  findByMonth(
    @Param('year') year: number,
    @Param('month') month: number
  ) {
    return this.expensesService.findByMonth(Number(year), Number(month));
  }

  @Get('reports/total')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get total expenses by date range' })
  @ApiQuery({ name: 'start_date', required: false, description: 'Start date (YYYY-MM-DD)', type: 'string' })
  @ApiQuery({ name: 'end_date', required: false, description: 'End date (YYYY-MM-DD)', type: 'string' })
  getTotalExpensesByDateRange(
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string
  ) {
    if (!startDate || !endDate) {
      return { total: 0, count: 0 };
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.expensesService.getTotalExpensesByDateRange(start, end);
  }


  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update expense' })
  @ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete expense (soft delete)' })
  @ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
