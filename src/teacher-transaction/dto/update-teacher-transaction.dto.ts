import { PartialType } from '@nestjs/swagger';
import { CreateTeacherTransactionDto } from './create-teacher-transaction.dto.js';

export class UpdateTeacherTransactionDto extends PartialType(CreateTeacherTransactionDto) {}
