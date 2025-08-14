import { PartialType } from '@nestjs/mapped-types';
import { CreateSpeakingDto } from './create-speaking.dto.js';

export class UpdateSpeakingDto extends PartialType(CreateSpeakingDto) {}
