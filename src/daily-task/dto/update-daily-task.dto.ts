import { PartialType } from '@nestjs/swagger';
import { CreateDailyTaskDto } from './create-daily-task.dto';

export class UpdateDailyTaskDto extends PartialType(CreateDailyTaskDto) {}
