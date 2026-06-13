import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseCategoryDto } from './dto/create-expense-category.dto.js';
import { UpdateExpenseCategoryDto } from './dto/update-expense-category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../roles/role.enum.js';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Expense Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expense-categories')
export class ExpenseCategoriesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: 'Create a new expense category' })
  create(@Body() createExpenseCategoryDto: CreateExpenseCategoryDto) {
    return this.expensesService.createCategory(createExpenseCategoryDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: 'Get all expense categories' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter categories by name (partial, case-insensitive match)', type: 'string' })
  @ApiQuery({ name: 'names', required: false, description: 'Filter by multiple names at once (comma-separated, each a partial case-insensitive match)', type: 'string' })
  findAll(@Query('name') name?: string, @Query('names') names?: string) {
    const nameList = names
      ? names.split(',').map((n) => n.trim()).filter(Boolean)
      : undefined;
    return this.expensesService.findAllCategories(name, nameList);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: 'Get expense category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOneCategory(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: 'Update expense category' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  update(@Param('id') id: string, @Body() updateExpenseCategoryDto: UpdateExpenseCategoryDto) {
    return this.expensesService.updateCategory(id, updateExpenseCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN, Role.OWNER, Role.MANAGER)
  @ApiOperation({ summary: 'Delete expense category (soft delete)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' })
  remove(@Param('id') id: string) {
    return this.expensesService.removeCategory(id);
  }
}
