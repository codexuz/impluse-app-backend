import { Module } from '@nestjs/common';
import { ContestFeedService } from './contest-feed.service';
import { ContestFeedController } from './contest-feed.controller';

@Module({
  controllers: [ContestFeedController],
  providers: [ContestFeedService],
})
export class ContestFeedModule {}
