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
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FormsService } from './forms.service.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';
let FormsController = class FormsController {
    constructor(formsService) {
        this.formsService = formsService;
    }
    create(createFormDto) {
        return this.formsService.create(createFormDto);
    }
    findAll() {
        return this.formsService.findAll();
    }
    findOne(id) {
        return this.formsService.findOne(id);
    }
    update(id, updateFormDto) {
        return this.formsService.update(id, updateFormDto);
    }
    remove(id) {
        return this.formsService.remove(id);
    }
    createResponse(createResponseDto) {
        return this.formsService.createResponse(createResponseDto);
    }
    findAllResponses() {
        return this.formsService.findAllResponses();
    }
    findResponsesByForm(formId) {
        return this.formsService.findResponsesByForm(+formId);
    }
    findOneResponse(id) {
        return this.formsService.findOneResponse(+id);
    }
    updateResponse(id, updateResponseDto) {
        return this.formsService.updateResponse(+id, updateResponseDto);
    }
    removeResponse(id) {
        return this.formsService.removeResponse(+id);
    }
};
__decorate([
    Post(),
    ApiOperation({ summary: 'Create a new form' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'The form has been successfully created' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "create", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Get all forms' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all forms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get a form by ID' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return the form' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Update a form' }),
    ApiResponse({ status: HttpStatus.OK, description: 'The form has been successfully updated' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateFormDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete a form' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The form has been successfully deleted' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "remove", null);
__decorate([
    Post('responses'),
    ApiOperation({ summary: 'Submit a form response' }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'The response has been successfully created' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateResponseDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "createResponse", null);
__decorate([
    Get('responses'),
    ApiOperation({ summary: 'Get all form responses' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all responses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findAllResponses", null);
__decorate([
    Get('responses/form/:formId'),
    ApiOperation({ summary: 'Get all responses for a specific form' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return all responses for this form' }),
    __param(0, Param('formId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findResponsesByForm", null);
__decorate([
    Get('responses/:id'),
    ApiOperation({ summary: 'Get a response by ID' }),
    ApiResponse({ status: HttpStatus.OK, description: 'Return the response' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "findOneResponse", null);
__decorate([
    Patch('responses/:id'),
    ApiOperation({ summary: 'Update a response' }),
    ApiResponse({ status: HttpStatus.OK, description: 'The response has been successfully updated' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateResponseDto]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "updateResponse", null);
__decorate([
    Delete('responses/:id'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Delete a response' }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The response has been successfully deleted' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FormsController.prototype, "removeResponse", null);
FormsController = __decorate([
    ApiTags('Forms'),
    Controller('forms'),
    __metadata("design:paramtypes", [FormsService])
], FormsController);
export { FormsController };
//# sourceMappingURL=forms.controller.js.map