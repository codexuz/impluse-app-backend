import { PartialType } from '@nestjs/swagger';
import { CreateContestFeedDto } from './create-contest-feed.dto';

export class UpdateContestFeedDto extends PartialType(CreateContestFeedDto) {}
