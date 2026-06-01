import { PartialType } from "@nestjs/swagger";
import { CreateStaffProfileDto } from "./create-staff-profile.dto.js";

export class UpdateStaffProfileDto extends PartialType(CreateStaffProfileDto) {}
