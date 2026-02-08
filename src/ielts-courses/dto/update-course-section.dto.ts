import { PartialType } from "@nestjs/swagger";
import { CreateCourseSectionDto } from "./create-course-section.dto.js";

export class UpdateCourseSectionDto extends PartialType(
  CreateCourseSectionDto,
) {}
