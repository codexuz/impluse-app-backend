import { Injectable } from '@nestjs/common';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';
import { UpdateDailyTaskDto } from './dto/update-daily-task.dto';

@Injectable()
export class DailyTaskService {
  create(createDailyTaskDto: CreateDailyTaskDto) {
    return 'This action adds a new dailyTask';
  }

  findAll() {
    return `This action returns all dailyTask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dailyTask`;
  }

  update(id: number, updateDailyTaskDto: UpdateDailyTaskDto) {
    return `This action updates a #${id} dailyTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} dailyTask`;
  }
}
