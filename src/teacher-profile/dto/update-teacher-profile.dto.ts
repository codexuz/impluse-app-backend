import { PartialType } from '@nestjs/swagger';
import { CreateTeacherProfileDto } from './create-teacher-profile.dto.js';

export class UpdateTeacherProfileDto extends PartialType(CreateTeacherProfileDto) {}
