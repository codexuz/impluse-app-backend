import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Form } from './entities/form.entity.js';
import { Response } from './entities/response.entity.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private formModel: typeof Form,
    @InjectModel(Response)
    private responseModel: typeof Response,
  ) {}

  // Form CRUD operations
  async create(createFormDto: CreateFormDto): Promise<Form> {
    return this.formModel.create({ ...createFormDto });
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.findAll();
  }

  async findOne(id: number): Promise<Form> {
    const form = await this.formModel.findByPk(id);
    if (!form) {
      throw new NotFoundException(`Form with ID "${id}" not found`);
    }
    return form;
  }

  async update(id: number, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id);
    await form.update(updateFormDto);
    return form;
  }

  async remove(id: number): Promise<void> {
    const form = await this.findOne(id);
    await form.destroy();
  }

  // Response CRUD operations
  async createResponse(createResponseDto: CreateResponseDto): Promise<Response> {
    // Verify form exists
    await this.findOne(createResponseDto.form_id);
    return this.responseModel.create({ ...createResponseDto });
  }

  async findAllResponses(): Promise<Response[]> {
    return this.responseModel.findAll();
  }

  async findResponsesByForm(formId: number): Promise<Response[]> {
    return this.responseModel.findAll({
      where: { form_id: formId }
    });
  }

  async findOneResponse(id: number): Promise<Response> {
    const response = await this.responseModel.findByPk(id);
    if (!response) {
      throw new NotFoundException(`Response with ID "${id}" not found`);
    }
    return response;
  }

  async updateResponse(id: number, updateResponseDto: UpdateResponseDto): Promise<Response> {
    const response = await this.findOneResponse(id);
    await response.update(updateResponseDto);
    return response;
  }

  async removeResponse(id: number): Promise<void> {
    const response = await this.findOneResponse(id);
    await response.destroy();
  }
}
