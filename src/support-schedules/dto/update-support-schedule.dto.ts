import { PartialType } from '@nestjs/swagger';
import { CreateSupportScheduleDto } from './create-support-schedule.dto.js';

export class UpdateSupportScheduleDto extends PartialType(CreateSupportScheduleDto) {}
