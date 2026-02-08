import { PartialType } from '@nestjs/swagger';
import { CreateIeltsCourseDto } from './create-ielts-course.dto.js';

export class UpdateIeltsCourseDto extends PartialType(CreateIeltsCourseDto) {}
