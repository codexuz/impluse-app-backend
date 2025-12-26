import { Module } from '@nestjs/common';
import { DailyTaskService } from './daily-task.service';
import { DailyTaskController } from './daily-task.controller';

@Module({
  controllers: [DailyTaskController],
  providers: [DailyTaskService],
})
export class DailyTaskModule {}
