import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FormsService } from './forms.service.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Form endpoints
  @Post()
  @ApiOperation({ summary: 'Create a new form' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The form has been successfully created' })
  create(@Body() createFormDto: CreateFormDto) {
    return this.formsService.create(createFormDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all forms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all forms' })
  findAll() {
    return this.formsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a form by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the form' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' })
  findOne(@Param('id') id: string) {
    return this.formsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a form' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The form has been successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' })
  update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a form' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The form has been successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Form not found' })
  remove(@Param('id') id: string) {
    return this.formsService.remove(id);
  }

  // Response endpoints
  @Post('responses')
  @ApiOperation({ summary: 'Submit a form response' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The response has been successfully created' })
  createResponse(@Body() createResponseDto: CreateResponseDto) {
    return this.formsService.createResponse(createResponseDto);
  }

  @Get('responses')
  @ApiOperation({ summary: 'Get all form responses' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all responses' })
  findAllResponses() {
    return this.formsService.findAllResponses();
  }

  @Get('responses/form/:formId')
  @ApiOperation({ summary: 'Get all responses for a specific form' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all responses for this form' })
  findResponsesByForm(@Param('formId') formId: string) {
    return this.formsService.findResponsesByForm(+formId);
  }

  @Get('responses/:id')
  @ApiOperation({ summary: 'Get a response by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the response' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' })
  findOneResponse(@Param('id') id: string) {
    return this.formsService.findOneResponse(+id);
  }

  @Patch('responses/:id')
  @ApiOperation({ summary: 'Update a response' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The response has been successfully updated' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' })
  updateResponse(@Param('id') id: string, @Body() updateResponseDto: UpdateResponseDto) {
    return this.formsService.updateResponse(+id, updateResponseDto);
  }

  @Delete('responses/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a response' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The response has been successfully deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Response not found' })
  removeResponse(@Param('id') id: string) {
    return this.formsService.removeResponse(+id);
  }
}
