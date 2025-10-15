import { PartialType } from '@nestjs/swagger';
import { CreateSpeakingResponseDto } from './create-speaking-response.dto.js';

export class UpdateSpeakingResponseDto extends PartialType(CreateSpeakingResponseDto) {}
