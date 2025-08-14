import { PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto.js';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}