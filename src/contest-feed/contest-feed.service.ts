import { Injectable } from '@nestjs/common';
import { CreateContestFeedDto } from './dto/create-contest-feed.dto';
import { UpdateContestFeedDto } from './dto/update-contest-feed.dto';

@Injectable()
export class ContestFeedService {
  create(createContestFeedDto: CreateContestFeedDto) {
    return 'This action adds a new contestFeed';
  }

  findAll() {
    return `This action returns all contestFeed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contestFeed`;
  }

  update(id: number, updateContestFeedDto: UpdateContestFeedDto) {
    return `This action updates a #${id} contestFeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} contestFeed`;
  }
}
