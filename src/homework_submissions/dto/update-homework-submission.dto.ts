import { PartialType } from '@nestjs/swagger';
import { CreateHomeworkSubmissionDto } from './create-homework-submission.dto.js';

export class UpdateHomeworkSubmissionDto extends PartialType(CreateHomeworkSubmissionDto) {}
