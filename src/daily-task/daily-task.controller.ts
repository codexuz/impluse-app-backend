import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DailyTaskService } from './daily-task.service';
import { CreateDailyTaskDto } from './dto/create-daily-task.dto';
import { UpdateDailyTaskDto } from './dto/update-daily-task.dto';

@Controller('daily-task')
export class DailyTaskController {
  constructor(private readonly dailyTaskService: DailyTaskService) {}

  @Post()
  create(@Body() createDailyTaskDto: CreateDailyTaskDto) {
    return this.dailyTaskService.create(createDailyTaskDto);
  }

  @Get()
  findAll() {
    return this.dailyTaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyTaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyTaskDto: UpdateDailyTaskDto) {
    return this.dailyTaskService.update(+id, updateDailyTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dailyTaskService.remove(+id);
  }
}
