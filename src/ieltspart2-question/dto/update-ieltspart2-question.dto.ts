import { PartialType } from '@nestjs/swagger';
import { CreateIeltspart2QuestionDto } from './create-ieltspart2-question.dto.js';

export class UpdateIeltspart2QuestionDto extends PartialType(CreateIeltspart2QuestionDto) {}
