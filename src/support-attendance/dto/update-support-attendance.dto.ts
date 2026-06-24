import { PartialType } from "@nestjs/swagger";
import { CreateSupportAttendanceDto } from "./create-support-attendance.dto.js";

export class UpdateSupportAttendanceDto extends PartialType(
  CreateSupportAttendanceDto,
) {}
