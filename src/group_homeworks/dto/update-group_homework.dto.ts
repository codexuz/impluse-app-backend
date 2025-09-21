import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupHomeworkDto } from './create-group-homework.dto.js';

export class UpdateGroupHomeworkDto extends PartialType(CreateGroupHomeworkDto) {}
