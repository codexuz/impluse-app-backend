import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCourseDto } from './create-user-course.dto.js';

export class UpdateUserCourseDto extends PartialType(CreateUserCourseDto) {}
