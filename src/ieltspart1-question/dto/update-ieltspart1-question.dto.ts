import { PartialType } from '@nestjs/swagger';
import { CreateIeltspart1QuestionDto } from './create-ieltspart1-question.dto.js';

export class UpdateIeltspart1QuestionDto extends PartialType(CreateIeltspart1QuestionDto) {}
