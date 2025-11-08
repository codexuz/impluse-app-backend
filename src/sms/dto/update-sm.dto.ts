import { PartialType } from '@nestjs/swagger';
import { CreateSmDto } from './create-sm.dto.js';

export class UpdateSmDto extends PartialType(CreateSmDto) {}
