import { PartialType } from '@nestjs/swagger';
import { CreateStudentWalletDto } from './create-student-wallet.dto.js';

export class UpdateStudentWalletDto extends PartialType(CreateStudentWalletDto) {}
