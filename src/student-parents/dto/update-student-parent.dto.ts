import { PartialType } from '@nestjs/swagger';
import { CreateStudentParentDto } from './create-student-parent.dto.js';

export class UpdateStudentParentDto extends PartialType(CreateStudentParentDto) {}
