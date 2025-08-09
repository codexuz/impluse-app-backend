import { PartialType } from '@nestjs/swagger';
import { CreateGroupChatDto } from './create-group-chat.dto.js';

export class UpdateGroupChatDto extends PartialType(CreateGroupChatDto) {}
