import { PartialType } from '@nestjs/swagger';
import { CreateCdIeltDto } from './create-cd-ielt.dto.js';

export class UpdateCdIeltDto extends PartialType(CreateCdIeltDto) {}
