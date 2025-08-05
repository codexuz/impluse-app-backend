import { PartialType } from '@nestjs/swagger';
import { CreateAttendanceStatusDto } from './create-attendance-status.dto.js';

export class UpdateAttendanceStatusDto extends PartialType(CreateAttendanceStatusDto) {}
