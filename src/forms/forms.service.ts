import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Form } from './entities/form.entity.js';
import { Response } from './entities/response.entity.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';
import { RequestFormOtpDto } from './dto/request-form-otp.dto.js';
import { SmsVerification } from '../users/entities/sms-verification.model.js';
import { SmsService } from '../sms/sms.service.js';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form)
    private formModel: typeof Form,
    @InjectModel(Response)
    private responseModel: typeof Response,
    @InjectModel(SmsVerification)
    private smsVerificationModel: typeof SmsVerification,
    private smsService: SmsService,
  ) {}

  // Form CRUD operations
  async create(createFormDto: CreateFormDto): Promise<Form> {
    return this.formModel.create({ ...createFormDto });
  }

  async findAll(): Promise<Form[]> {
    return this.formModel.findAll();
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findByPk(id);
    if (!form) {
      throw new NotFoundException(`Form with ID "${id}" not found`);
    }
    return form;
  }

  async update(id: string, updateFormDto: UpdateFormDto): Promise<Form> {
    const form = await this.findOne(id);
    await form.update(updateFormDto);
    return form;
  }

  async remove(id: string): Promise<void> {
    const form = await this.findOne(id);
    await form.destroy();
  }

  // SMS verification for form responses
  async requestResponseOtp(dto: RequestFormOtpDto): Promise<{ message: string }> {
    const form = await this.findOne(dto.form_id);

    if (!form.smsVerification) {
      throw new BadRequestException('This form does not require SMS verification');
    }

    // Invalidate any existing unused codes for this phone + form
    await this.smsVerificationModel.update(
      { isVerified: true },
      {
        where: {
          phone: dto.phone,
          isVerified: false,
        },
      },
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.smsVerificationModel.create({
      phone: dto.phone,
      code,
      isVerified: false,
      expiresAt,
    });

    await this.smsService.sendVerificationCode(dto.phone, code);

    return { message: 'Verification code sent' };
  }

  private async verifyResponseOtp(phone: string, code: string): Promise<void> {
    const verification = await this.smsVerificationModel.findOne({
      where: {
        phone,
        code,
        isVerified: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await verification.update({ isVerified: true });
  }

  // Response CRUD operations
  async createResponse(createResponseDto: CreateResponseDto): Promise<Response> {
    // Verify form exists
    const form = await this.findOne(createResponseDto.form_id);

    if (form.smsVerification) {
      const { phone, code } = createResponseDto;
      if (!phone || !code) {
        throw new BadRequestException(
          'Phone and verification code are required for this form',
        );
      }
      await this.verifyResponseOtp(phone, code);
    }

    const { phone, code, ...responseData } = createResponseDto;
    return this.responseModel.create({ ...responseData });
  }

  async findAllResponses(): Promise<Response[]> {
    return this.responseModel.findAll();
  }

  async findResponsesByForm(formId: string): Promise<Response[]> {
    return this.responseModel.findAll({
      where: { form_id: formId }
    });
  }

  async findOneResponse(id: string): Promise<Response> {
    const response = await this.responseModel.findByPk(id);
    if (!response) {
      throw new NotFoundException(`Response with ID "${id}" not found`);
    }
    return response;
  }

  async updateResponse(id: string, updateResponseDto: UpdateResponseDto): Promise<Response> {
    const response = await this.findOneResponse(id);
    await response.update(updateResponseDto);
    return response;
  }

  async removeResponse(id: string): Promise<void> {
    const response = await this.findOneResponse(id);
    await response.destroy();
  }
}
