import { Test, TestingModule } from '@nestjs/testing';
import { DailyTaskService } from './daily-task.service';

describe('DailyTaskService', () => {
  let service: DailyTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyTaskService],
    }).compile();

    service = module.get<DailyTaskService>(DailyTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
