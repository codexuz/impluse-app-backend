import { PartialType } from '@nestjs/mapped-types';
import { CreateWritingDto } from './create-writing.dto.js';

export class UpdateWritingDto extends PartialType(CreateWritingDto) {}
