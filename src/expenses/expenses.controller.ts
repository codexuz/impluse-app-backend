import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto.js';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto.js';
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

  // ============= EXPENSE CATEGORIES ENDPOINTS =============

  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new expense category' })
  createCategory(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return this.expensesService.createCategory(createExpenseCategoryDto);
  }

  @Get('categories')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all expense categories' })
  findAllCategories() {
    return this.expensesService.findAllCategories();
  }

  @Get('categories/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get expense category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  findOneCategory(@Param('id') id: string) {
    return this.expensesService.findOneCategory(id);
  }

  @Patch('categories/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update expense category' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  updateCategory(@Param('id') id: string, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto) {
    return this.expensesService.updateCategory(id, updateExpenseCategoryDto);
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete expense category (soft delete)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  removeCategory(@Param('id') id: string) {
    return this.expensesService.removeCategory(id);
  }
}
