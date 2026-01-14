import { PartialType } from '@nestjs/swagger';
import { CreateCompensateLessonDto } from './create-compensate-lesson.dto.js';

export class UpdateCompensateLessonDto extends PartialType(CreateCompensateLessonDto) {}
