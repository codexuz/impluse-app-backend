import { PartialType } from "@nestjs/swagger";
import { CreateIeltsLessonProgressDto } from "./create-lesson-progress.dto.js";

export class UpdateIeltsLessonProgressDto extends PartialType(
  CreateIeltsLessonProgressDto,
) {}
