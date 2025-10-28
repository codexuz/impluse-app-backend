import { PartialType } from '@nestjs/swagger';
import { CreateTeacherWalletDto } from './create-teacher-wallet.dto.js';

export class UpdateTeacherWalletDto extends PartialType(CreateTeacherWalletDto) {}
