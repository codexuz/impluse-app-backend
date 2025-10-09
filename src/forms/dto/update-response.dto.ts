import { PartialType } from '@nestjs/swagger';
import { CreateResponseDto } from './create-response.dto.js';

export class UpdateResponseDto extends PartialType(CreateResponseDto) {}