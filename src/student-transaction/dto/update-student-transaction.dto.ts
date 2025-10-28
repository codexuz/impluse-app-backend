import { PartialType } from '@nestjs/swagger';
import { CreateStudentTransactionDto } from './create-student-transaction.dto.js';

export class UpdateStudentTransactionDto extends PartialType(CreateStudentTransactionDto) {}
