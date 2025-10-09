import { PartialType } from '@nestjs/swagger';
import { CreateFormDto } from './create-form.dto.js';

export class UpdateFormDto extends PartialType(CreateFormDto) {}
