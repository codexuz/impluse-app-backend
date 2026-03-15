import { PartialType } from "@nestjs/swagger";
import { CreateIeltsLessonDto } from "./create-lesson.dto.js";

export class UpdateIeltsLessonDto extends PartialType(CreateIeltsLessonDto) {}
