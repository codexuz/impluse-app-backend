import { PartialType } from "@nestjs/swagger";
import { CreateSupportAssignmentDto } from "./create-support-assignment.dto.js";

export class UpdateSupportAssignmentDto extends PartialType(
  CreateSupportAssignmentDto,
) {}
