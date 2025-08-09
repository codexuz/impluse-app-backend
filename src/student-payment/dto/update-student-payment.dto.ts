import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentPaymentDto } from './create-student-payment.dto.js';

export class UpdateStudentPaymentDto extends PartialType(CreateStudentPaymentDto) {}
