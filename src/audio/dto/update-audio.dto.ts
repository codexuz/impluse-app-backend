import { PartialType } from '@nestjs/swagger';
import { CreateAudioDto } from './create-audio-barrel.dto.js';

export class UpdateAudioDto extends PartialType(CreateAudioDto) {}

