import { Test, TestingModule } from '@nestjs/testing';
import { DailyTaskController } from './daily-task.controller';
import { DailyTaskService } from './daily-task.service';

describe('DailyTaskController', () => {
  let controller: DailyTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyTaskController],
      providers: [DailyTaskService],
    }).compile();

    controller = module.get<DailyTaskController>(DailyTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
