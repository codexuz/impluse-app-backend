import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSpeakingResponseDto } from './dto/create-speaking-response.dto.js';
import { UpdateSpeakingResponseDto } from './dto/update-speaking-response.dto.js';
import { SpeakingResponse } from './entities/speaking-response.entity.js';

@Injectable()
export class SpeakingResponseService {
  constructor(
    @InjectModel(SpeakingResponse)
    private speakingResponseModel: typeof SpeakingResponse,
  ) {}

  async create(createSpeakingResponseDto: CreateSpeakingResponseDto): Promise<SpeakingResponse> {
    return this.speakingResponseModel.create({
      ...createSpeakingResponseDto,
    });
  }

  async findAll(): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll();
  }

  async findOne(id: string): Promise<SpeakingResponse> {
    const response = await this.speakingResponseModel.findByPk(id);
    if (!response) {
      throw new NotFoundException(`Speaking response with ID ${id} not found`);
    }
    return response;
  }

  async findBySpeakingId(speakingId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        speaking_id: speakingId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findByType(responseType: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        response_type: responseType,
      },
      order: [['createdAt', 'DESC']],
    });
  }
  
  async findByStudentId(studentId: string): Promise<SpeakingResponse[]> {
    return this.speakingResponseModel.findAll({
      where: {
        student_id: studentId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async update(id: string, updateSpeakingResponseDto: UpdateSpeakingResponseDto): Promise<SpeakingResponse> {
    const response = await this.findOne(id);
    await response.update(updateSpeakingResponseDto);
    return response;
  }

  async remove(id: string): Promise<void> {
    const response = await this.findOne(id);
    await response.destroy();
  }
}
