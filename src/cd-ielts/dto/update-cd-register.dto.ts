import { PartialType } from '@nestjs/swagger';
import { CreateCdRegisterDto } from './create-cd-register.dto.js';

export class UpdateCdRegisterDto extends PartialType(CreateCdRegisterDto) {}