import { PartialType } from '@nestjs/mapped-types';
import { CreateGroupAssignedLessonDto } from './create-group_assigned_lesson.dto.js';

export class UpdateGroupAssignedLessonDto extends PartialType(CreateGroupAssignedLessonDto) {}
