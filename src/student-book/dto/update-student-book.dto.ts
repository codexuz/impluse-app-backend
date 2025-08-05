import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentBookDto } from './create-student-book.dto.js';

export class UpdateStudentBookDto extends PartialType(CreateStudentBookDto) {}
