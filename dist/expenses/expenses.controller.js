var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
let ExpensesController = class ExpensesController {
    constructor(expensesService) {
        this.expensesService = expensesService;
    }
    create(createExpenseDto) {
        return this.expensesService.create(createExpenseDto);
    }
    findAll(categoryId, teacherId, reportedBy) {
        return this.expensesService.findAll(categoryId, teacherId, reportedBy);
    }
    findOne(id) {
        return this.expensesService.findOne(id);
    }
    update(id, updateExpenseDto) {
        return this.expensesService.update(id, updateExpenseDto);
    }
    remove(id) {
        return this.expensesService.remove(id);
    }
    createCategory(createExpenseCategoryDto) {
        return this.expensesService.createCategory(createExpenseCategoryDto);
    }
    findAllCategories() {
        return this.expensesService.findAllCategories();
    }
    findOneCategory(id) {
        return this.expensesService.findOneCategory(id);
    }
    updateCategory(id, updateExpenseCategoryDto) {
        return this.expensesService.updateCategory(id, updateExpenseCategoryDto);
    }
    removeCategory(id) {
        return this.expensesService.removeCategory(id);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new expense' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "create", null);
__decorate([
    Get(),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all expenses' }),
    ApiQuery({ name: 'category_id', required: false, description: 'Filter by category ID' }),
    ApiQuery({ name: 'teacher_id', required: false, description: 'Filter by teacher ID' }),
    ApiQuery({ name: 'reported_by', required: false, description: 'Filter by reporter user ID' }),
    __param(0, Query('category_id')),
    __param(1, Query('teacher_id')),
    __param(2, Query('reported_by')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get expense by ID' }),
    ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update expense' }),
    ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete expense (soft delete)' }),
    ApiParam({ name: 'id', description: 'Expense ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "remove", null);
__decorate([
    Post('categories'),
    HttpCode(HttpStatus.CREATED),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Create a new expense category' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "createCategory", null);
__decorate([
    Get('categories'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get all expense categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findAllCategories", null);
__decorate([
    Get('categories/:id'),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Get expense category by ID' }),
    ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "findOneCategory", null);
__decorate([
    Patch('categories/:id'),
    HttpCode(HttpStatus.OK),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Update expense category' }),
    ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateExpenseCategoryDto]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "updateCategory", null);
__decorate([
    Delete('categories/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    Roles(Role.ADMIN),
    ApiOperation({ summary: 'Delete expense category (soft delete)' }),
    ApiParam({ name: 'id', description: 'Category ID (UUID)', type: 'string' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpensesController.prototype, "removeCategory", null);
ExpensesController = __decorate([
    ApiTags('Expenses'),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    Controller('expenses'),
    __metadata("design:paramtypes", [ExpensesService])
], ExpensesController);
export { ExpensesController };
//# sourceMappingURL=expenses.controller.js.map