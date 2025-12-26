import { PartialType } from '@nestjs/swagger';
import { CreateFeedVideoDto } from './create-feed-video.dto.js';

export class UpdateFeedVideoDto extends PartialType(CreateFeedVideoDto) {}
